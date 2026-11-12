CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"project_id" uuid,
	"title" text NOT NULL,
	"href" text NOT NULL,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_updates" (
	"user_id" uuid PRIMARY KEY,
	"revision" bigint DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace_invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"workspace_id" uuid NOT NULL,
	"email" text NOT NULL,
	"role" "workspace_role" DEFAULT 'member'::"workspace_role" NOT NULL,
	"invited_by" uuid,
	"token_hash" text NOT NULL UNIQUE,
	"status" text DEFAULT 'pending' NOT NULL,
	"delivery_status" text DEFAULT 'sending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"accepted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_invitation_email_unique" UNIQUE("workspace_id","email")
);
--> statement-breakpoint
CREATE INDEX "notifications_user_created_idx" ON "notifications" ("user_id","created_at");--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_project_id_projects_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_updates" ADD CONSTRAINT "user_updates_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workspace_invitations" ADD CONSTRAINT "workspace_invitations_workspace_id_workspaces_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workspace_invitations" ADD CONSTRAINT "workspace_invitations_invited_by_users_id_fkey" FOREIGN KEY ("invited_by") REFERENCES "users"("id") ON DELETE SET NULL;
--> statement-breakpoint
CREATE FUNCTION kylro_touch_user(target_user uuid) RETURNS void LANGUAGE plpgsql SET search_path FROM CURRENT AS $$
BEGIN
  INSERT INTO user_updates (user_id, revision) SELECT id, 1 FROM users WHERE id = target_user
  ON CONFLICT (user_id) DO UPDATE SET revision = user_updates.revision + 1;
END;
$$;
--> statement-breakpoint
CREATE FUNCTION kylro_notification_changed() RETURNS trigger LANGUAGE plpgsql SET search_path FROM CURRENT AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN PERFORM kylro_touch_user(OLD.user_id); RETURN OLD; END IF;
  PERFORM kylro_touch_user(NEW.user_id); RETURN NEW;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER notification_changed AFTER INSERT OR UPDATE OR DELETE ON notifications FOR EACH ROW EXECUTE FUNCTION kylro_notification_changed();
--> statement-breakpoint
CREATE FUNCTION kylro_project_event() RETURNS trigger LANGUAGE plpgsql SET search_path FROM CURRENT AS $$
DECLARE target_project uuid; target_workspace uuid; target_issue uuid; label text; destination text; recipient uuid; issue_title text;
BEGIN
  IF TG_TABLE_NAME = 'issues' THEN
    IF TG_OP = 'DELETE' THEN target_project := OLD.project_id; label := 'Issue deleted: ' || OLD.title; target_issue := OLD.id;
    ELSE
      target_project := NEW.project_id; target_issue := NEW.id;
      IF TG_OP = 'INSERT' THEN label := 'Issue created: ' || NEW.title;
      ELSE
        IF ROW(NEW.title,NEW.description,NEW.status,NEW.assigned_to) IS NOT DISTINCT FROM ROW(OLD.title,OLD.description,OLD.status,OLD.assigned_to) THEN RETURN NEW; END IF;
        label := 'Issue updated: ' || NEW.title;
      END IF;
    END IF;
  ELSIF TG_TABLE_NAME = 'comments' THEN
    SELECT i.project_id, i.title, i.id INTO target_project, issue_title, target_issue FROM issues i WHERE i.id = NEW.issue_id;
    label := 'New comment on: ' || issue_title;
  ELSE
    IF TG_OP = 'DELETE' THEN target_project := OLD.project_id; recipient := OLD.user_id;
    ELSE target_project := NEW.project_id; recipient := NEW.user_id; END IF;
    PERFORM kylro_touch_user(recipient);
    label := 'Project membership ' || CASE WHEN TG_OP = 'INSERT' THEN 'added' WHEN TG_OP = 'DELETE' THEN 'removed' ELSE 'updated' END;
  END IF;
  SELECT workspace_id INTO target_workspace FROM projects WHERE id = target_project;
  -- During cascades the parent may already be gone. Its own trigger handles invalidation.
  IF target_workspace IS NULL THEN RETURN NULL; END IF;
  destination := '/projects/' || target_project || CASE WHEN TG_TABLE_NAME = 'project_members' THEN '/members' ELSE '/issues' END;
  IF target_issue IS NOT NULL AND TG_OP <> 'DELETE' THEN destination := destination || '?q=ISS-' || upper(left(target_issue::text,6)); END IF;
  INSERT INTO notifications (user_id,workspace_id,project_id,title,href)
    SELECT pm.user_id,target_workspace,target_project,left(label,240),destination
    FROM project_members pm JOIN workspace_members wm ON wm.workspace_id=target_workspace AND wm.user_id=pm.user_id
    WHERE pm.project_id=target_project;
  IF TG_TABLE_NAME = 'project_members' AND TG_OP = 'DELETE' THEN
    DELETE FROM notifications WHERE user_id=OLD.user_id AND project_id=OLD.project_id;
  END IF;
  RETURN NULL;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER issue_event AFTER INSERT OR UPDATE OR DELETE ON issues FOR EACH ROW EXECUTE FUNCTION kylro_project_event();
--> statement-breakpoint
CREATE TRIGGER comment_event AFTER INSERT ON comments FOR EACH ROW EXECUTE FUNCTION kylro_project_event();
--> statement-breakpoint
CREATE TRIGGER project_member_event AFTER INSERT OR UPDATE OR DELETE ON project_members FOR EACH ROW EXECUTE FUNCTION kylro_project_event();
--> statement-breakpoint
CREATE FUNCTION kylro_workspace_event() RETURNS trigger LANGUAGE plpgsql SET search_path FROM CURRENT AS $$
DECLARE target_workspace uuid; recipient uuid; label text;
BEGIN
  IF TG_TABLE_NAME='workspaces' THEN
    IF TG_OP='DELETE' THEN target_workspace:=OLD.id; ELSE target_workspace:=NEW.id; END IF;
  ELSIF TG_TABLE_NAME='projects' THEN
    IF TG_OP='DELETE' THEN target_workspace:=OLD.workspace_id; ELSE target_workspace:=NEW.workspace_id; END IF;
  ELSE
    IF TG_OP='DELETE' THEN target_workspace:=OLD.workspace_id; ELSE target_workspace:=NEW.workspace_id; END IF;
  END IF;
  FOR recipient IN SELECT user_id FROM workspace_members WHERE workspace_id=target_workspace LOOP
    PERFORM kylro_touch_user(recipient);
  END LOOP;
  IF TG_TABLE_NAME='workspace_members' THEN
    IF TG_OP='DELETE' THEN
      PERFORM kylro_touch_user(OLD.user_id);
      DELETE FROM notifications WHERE user_id=OLD.user_id AND workspace_id=target_workspace;
    ELSE
      PERFORM kylro_touch_user(NEW.user_id);
      label := CASE WHEN TG_OP='INSERT' THEN 'A member joined your workspace' ELSE 'Workspace member permissions updated' END;
      INSERT INTO notifications(user_id,workspace_id,title,href)
        SELECT user_id,target_workspace,label,'/workspace/members?workspace=' || target_workspace FROM workspace_members WHERE workspace_id=target_workspace;
    END IF;
  ELSIF TG_TABLE_NAME='projects' AND TG_OP='UPDATE' THEN
    INSERT INTO notifications(user_id,workspace_id,project_id,title,href)
      SELECT user_id,target_workspace,NEW.id,'Project updated: ' || left(NEW.name,180),'/projects/' || NEW.id FROM project_members WHERE project_id=NEW.id;
  ELSIF TG_TABLE_NAME='projects' AND TG_OP='DELETE' THEN
    INSERT INTO notifications(user_id,workspace_id,title,href)
      SELECT pm.user_id,target_workspace,'Project deleted: ' || left(OLD.name,180),'/workspace/projects?workspace=' || target_workspace
      FROM project_members pm JOIN workspace_members wm ON wm.workspace_id=target_workspace AND wm.user_id=pm.user_id WHERE pm.project_id=OLD.id;
  END IF;
  IF TG_OP='DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER workspace_event AFTER UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION kylro_workspace_event();
--> statement-breakpoint
CREATE TRIGGER workspace_delete_event BEFORE DELETE ON workspaces FOR EACH ROW EXECUTE FUNCTION kylro_workspace_event();
--> statement-breakpoint
CREATE TRIGGER project_event AFTER INSERT OR UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION kylro_workspace_event();
--> statement-breakpoint
CREATE TRIGGER project_delete_event BEFORE DELETE ON projects FOR EACH ROW EXECUTE FUNCTION kylro_workspace_event();
--> statement-breakpoint
CREATE TRIGGER workspace_member_event AFTER INSERT OR UPDATE OR DELETE ON workspace_members FOR EACH ROW EXECUTE FUNCTION kylro_workspace_event();
--> statement-breakpoint
CREATE TRIGGER invitation_event AFTER INSERT OR UPDATE OR DELETE ON workspace_invitations FOR EACH ROW EXECUTE FUNCTION kylro_workspace_event();
