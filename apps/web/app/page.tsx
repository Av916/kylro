"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  CheckCheck,
  ChevronDown,
  Circle,
  CircleCheck,
  CircleDashed,
  Command,
  FolderKanban,
  LayoutDashboard,
  LayoutGrid,
  ListTodo,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { FeatureBento } from "@/components/landing/feature-bento";
import { Footer } from "@/components/landing/footer";
import { SectionHead } from "@/components/landing/section-head";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
} from "@/components/landing/ui/card";
import { Highlight } from "@/components/landing/ui/highlight";
import { Button } from "@/components/landing/ui/button";
import "./landing.css";
import styles from "./page.module.css";

function Brand() {
  return (
    <Link href="/" className={styles.brand} aria-label="Kylro home">
      <span className={styles.brandMark}>
        <span className={styles.brandGlyph}>k</span>
      </span>
      Kylro<span className={styles.brandDot}>.</span>
    </Link>
  );
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const tasks = [
  {
    id: "WEB-01",
    title: "Explore visual directions",
    label: "Design",
    person: "AK",
    comments: 2,
    state: 0,
  },
  {
    id: "WEB-02",
    title: "Write the homepage copy",
    label: "Content",
    person: "MR",
    comments: 3,
    state: 0,
  },
  {
    id: "WEB-03",
    title: "Build the landing page",
    label: "Development",
    person: "JD",
    comments: 4,
    state: 1,
  },
  {
    id: "WEB-04",
    title: "Review mobile layouts",
    label: "Design",
    person: "AK",
    comments: 1,
    state: 1,
  },
  {
    id: "WEB-05",
    title: "Kick off the project",
    label: "Planning",
    person: "MR",
    comments: 2,
    state: 2,
  },
];

function WorkspacePreview() {
  const [view, setView] = useState("Overview");
  const [completed, setCompleted] = useState(false);
  const currentTasks = tasks.map((task) =>
    task.id === "WEB-03" && completed ? { ...task, state: 2 } : task,
  );
  const reduced = useReducedMotion();
  return (
    <div className={styles.preview} id="preview">
      <div className={styles.windowBar}>
        <div className={styles.windowDots}>
          <i />
          <i />
          <i />
        </div>
        <span>
          <ShieldCheck size={12} /> Your team’s corner of the internet
        </span>
        <span className={styles.previewLabel}>Interactive preview</span>
      </div>
      <div className={styles.appFrame}>
        <aside className={styles.appSidebar} aria-label="Preview workspace">
          <div className={styles.workspaceName}>
            <span className={styles.workspaceIcon}>D</span> Design studio{" "}
            <ChevronDown size={12} />
          </div>
          <div className={styles.sidebarLabel}>Workspace</div>
          <span
            className={view === "Overview" ? styles.sidebarActive : undefined}
          >
            <LayoutDashboard />
            Overview
          </span>
          <span>
            <ListTodo />
            My issues <small>4</small>
          </span>
          <span>
            <Users />
            Members
          </span>
          <div className={styles.sidebarLabel}>
            Projects <Plus size={12} />
          </div>
          <span
            className={view !== "Overview" ? styles.sidebarActive : undefined}
          >
            <span className={styles.projectDot} />
            Website refresh
          </span>
          <span>
            <span className={styles.projectDot} />
            Mobile app
          </span>
          <span>
            <span className={styles.projectDot} />
            Brand guidelines
          </span>
          <div className={styles.sidebarBottom}>
            <span className={styles.avatar}>AK</span>
            <div>
              Alex Kim<small>Personal account</small>
            </div>
            <ChevronDown size={12} />
          </div>
        </aside>
        <div className={styles.appMain}>
          <div className={styles.breadcrumb}>
            Design studio <span>/</span>{" "}
            <strong>
              {view === "Overview" ? "Overview" : "Website refresh"}
            </strong>
            <Search size={14} />
          </div>
          {view !== "Overview" && (
            <div className={styles.projectHeading}>
              <div>
                <div className={styles.projectIcon}>
                  <FolderKanban size={21} />
                </div>
                <h2>Website refresh</h2>
                <p>A fresh start for our little corner of the web.</p>
              </div>
              <div className={styles.avatarStack}>
                <span>AK</span>
                <span>MR</span>
                <span>JD</span>
              </div>
            </div>
          )}
          <div className={styles.boardToolbar}>
            <div
              className={styles.viewTabs}
              role="tablist"
              aria-label="Preview view"
            >
              {["Overview", "Board", "List"].map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  id={`tab-${tab}`}
                  aria-controls="preview-panel"
                  aria-selected={view === tab}
                  tabIndex={view === tab ? 0 : -1}
                  onKeyDown={(event) => {
                    if (
                      event.key === "ArrowLeft" ||
                      event.key === "ArrowRight"
                    ) {
                      event.preventDefault();
                      const tabs = ["Overview", "Board", "List"];
                      const direction = event.key === "ArrowRight" ? 1 : -1;
                      const next =
                        tabs[
                          (tabs.indexOf(tab) + direction + tabs.length) %
                            tabs.length
                        ]!;
                      setView(next);
                      document.getElementById(`tab-${next}`)?.focus();
                    }
                  }}
                  onClick={() => setView(tab)}
                >
                  {tab === "Overview" ? (
                    <LayoutDashboard size={13} />
                  ) : tab === "Board" ? (
                    <LayoutGrid size={13} />
                  ) : (
                    <ListTodo size={13} />
                  )}{" "}
                  {tab}
                </button>
              ))}
            </div>
            <span className={styles.filterLabel}>
              <SlidersHorizontal size={12} /> All issues <span>5</span>
            </span>
          </div>
          <div
            id="preview-panel"
            role="tabpanel"
            aria-labelledby={`tab-${view}`}
            className={
              view === "Overview"
                ? styles.overviewPreview
                : view === "Board"
                  ? styles.boardColumns
                  : styles.issueList
            }
          >
            {view === "Overview" ? (
              <>
                <div className={styles.overviewGreeting}>
                  <span>Design studio</span>
                  <h2>Good morning, Alex.</h2>
                  <p>A little clarity for the day ahead.</p>
                </div>
                <div className={styles.overviewStats}>
                  {[
                    {
                      label: "Projects",
                      value: "3",
                      detail: "Ideas taking shape",
                      icon: FolderKanban,
                    },
                    {
                      label: "Active issues",
                      value: completed ? "3" : "4",
                      detail: "One step at a time",
                      icon: CircleDashed,
                    },
                    {
                      label: "Completed",
                      value: completed ? "2" : "1",
                      detail: "Good work adds up",
                      icon: CheckCheck,
                    },
                    {
                      label: "Members",
                      value: "3",
                      detail: "Better, together",
                      icon: Users,
                    },
                  ].map(({ label, value, detail, icon: Icon }) => (
                    <div key={label}>
                      <span>
                        {label}
                        <Icon size={16} />
                      </span>
                      <strong>{value}</strong>
                      <small>{detail}</small>
                    </div>
                  ))}
                </div>
                <div className={styles.overviewSectionTitle}>
                  <div>
                    <h3>Your projects</h3>
                    <p>A shared home for what’s next.</p>
                  </div>
                  <button onClick={() => setView("Board")}>
                    View board <ArrowUpRight size={13} />
                  </button>
                </div>
                <div className={styles.overviewProjects}>
                  {["Website refresh", "Mobile app"].map((name, i) => (
                    <button key={name} onClick={() => setView("Board")}>
                      <span className={styles.workspaceIcon}>
                        {i === 0 ? "W" : "M"}
                      </span>
                      <span>
                        <strong>{name}</strong>
                        <small>
                          {i === 0
                            ? "A fresh start for our corner of the web."
                            : "An idea with room to grow."}
                        </small>
                      </span>
                      <ArrowUpRight size={16} />
                      <span className={styles.overviewProjectMeta}>
                        <CircleCheck size={12} /> {i === 0 ? "5" : "8"} issues{" "}
                        <Users size={12} /> 3 members <small>Owner</small>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            ) : view === "Board" ? (
              ["To do", "In progress", "Done"].map((status, index) => (
                <div className={styles.boardColumn} key={status}>
                  <div className={styles.columnHeading}>
                    {index === 0 ? (
                      <CircleDashed size={13} />
                    ) : index === 1 ? (
                      <Circle size={13} className={styles.inProgress} />
                    ) : (
                      <CircleCheck size={13} className={styles.done} />
                    )}
                    <span>{status}</span>
                    <small>
                      {currentTasks.filter((t) => t.state === index).length}
                    </small>
                  </div>
                  {currentTasks
                    .filter((t) => t.state === index)
                    .map((task) => (
                      <motion.div
                        layout={!reduced}
                        transition={{ duration: 0.25 }}
                        key={task.id}
                        className={styles.task}
                      >
                        <div className={styles.taskTop}>
                          {task.id}
                          <MoreHorizontal size={13} />
                        </div>
                        <h3>{task.title}</h3>
                        <span className={styles.taskLabel}>{task.label}</span>
                        <div className={styles.taskBottom}>
                          {task.id === "WEB-03" ? (
                            <button
                              onClick={() => setCompleted((v) => !v)}
                              aria-label={
                                completed
                                  ? "Move landing page back to in progress"
                                  : "Mark landing page as done"
                              }
                              className={completed ? styles.done : undefined}
                            >
                              {completed ? (
                                <CircleCheck size={14} />
                              ) : (
                                <Circle size={14} />
                              )}{" "}
                              {completed ? "Done" : "Mark done"}
                            </button>
                          ) : (
                            <span>
                              <MessageSquare size={11} />
                              {task.comments}
                            </span>
                          )}
                          <span className={styles.avatar}>{task.person}</span>
                        </div>
                      </motion.div>
                    ))}
                </div>
              ))
            ) : (
              currentTasks.map((task) => (
                <div className={styles.issueRow} key={task.id}>
                  <span className={task.state === 2 ? styles.done : undefined}>
                    {task.state === 2 ? (
                      <CircleCheck size={14} />
                    ) : (
                      <CircleDashed size={14} />
                    )}
                  </span>
                  <small>{task.id}</small>
                  <strong>{task.title}</strong>
                  <span className={styles.taskLabel}>{task.label}</span>
                  <span className={styles.avatar}>{task.person}</span>
                </div>
              ))
            )}
          </div>
          <div className={styles.boardFooter}>
            <span>
              <span className={styles.liveDot} /> All changes in sync
            </span>
            <span>One team. A clearer picture.</span>
          </div>
        </div>
      </div>
      <div className={styles.previewHint}>
        <span>
          <Zap size={13} /> A little less busywork. A lot more momentum.
        </span>
        <span>
          Try the board <ArrowUpRight size={13} />
        </span>
      </div>
    </div>
  );
}

const features = [
  {
    icon: FolderKanban,
    number: "01",
    title: "A home for every project",
    text: "Give each idea a dedicated space. Keep issues, people, and progress together from the very first step.",
    visual: "projects",
  },
  {
    icon: ListTodo,
    number: "02",
    title: "Find your flow",
    text: "Turn plans into clear next steps. Assign issues, set priorities, and move work forward at your own pace.",
    visual: "issues",
  },
  {
    icon: MessageSquare,
    number: "03",
    title: "Keep the context close",
    text: "Leave a thought, share an update, or work through a detail. The conversation lives alongside the work.",
    visual: "comments",
  },
  {
    icon: Users,
    number: "04",
    title: "Bring your people",
    text: "Invite your team into one workspace. Clear roles help everyone find their place and get started.",
    visual: "people",
  },
];

function FeatureVisual({ type }: { type: string }) {
  if (type === "projects")
    return (
      <div className={styles.projectVisual}>
        {["Website refresh", "Mobile app", "Brand guidelines"].map(
          (name, i) => (
            <div key={name}>
              <FolderKanban size={15} />
              <span>{name}</span>
              <small>{[5, 8, 3][i]} issues</small>
              <ArrowUpRight size={13} />
            </div>
          ),
        )}
      </div>
    );
  if (type === "issues")
    return (
      <div className={styles.issueVisual}>
        <div>
          <CircleCheck size={15} />
          <span>Make a plan</span>
          <small>Done</small>
        </div>
        <div>
          <Circle size={15} />
          <span>Build something good</span>
          <small>In progress</small>
        </div>
        <div>
          <CircleDashed size={15} />
          <span>Share it with the world</span>
          <small>To do</small>
        </div>
      </div>
    );
  if (type === "comments")
    return (
      <div className={styles.commentVisual}>
        <span className={styles.avatar}>MR</span>
        <div>
          <strong>
            Maya <small>Just now</small>
          </strong>
          <p>Love this direction. Ready for a second look?</p>
          <span>
            <CheckCheck size={12} /> On the same page
          </span>
        </div>
      </div>
    );
  return (
    <div className={styles.peopleVisual}>
      <div className={styles.largeAvatars}>
        <span>AK</span>
        <span>MR</span>
        <span>JD</span>
        <span>
          <Plus size={16} />
        </span>
      </div>
      <div>
        <span className={styles.liveDot} /> Different minds. Shared momentum.
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <div className={`kylro-landing ${styles.page}`}>
        <a className={styles.skipLink} href="#main">
          Skip to content
        </a>

        <Navbar
          logo={<Brand />}
          layout="inline"
          groups={[
            { label: "The workspace", href: "#features" },
            { label: "How it works", href: "#how-it-works" },
          ]}
          actions={
            <Link className={styles.signIn} href="/login">
              Sign in <ArrowUpRight size={14} />
            </Link>
          }
        />
        <main id="main" className={styles.main}>
          <Reveal className={styles.heroWrap}>
            <Hero
              className={styles.hero}
              badge={
                <span className={styles.badgeContent}>
                  <span className={styles.liveDot} /> A little more clarity,
                  every day <ArrowUpRight size={12} />
                </span>
              }
              title={
                <>
                  Less scattered.
                  <br />
                  More <Highlight>in sync.</Highlight>
                </>
              }
              primary={{ label: "Start your workspace", href: "/signup" }}
              secondary={{ label: "Explore the workspace", href: "#preview" }}
            >
              Projects, people, and all the little details.
              <br className={styles.desktopBreak} /> One calm place to{" "}
              <Highlight>move good work forward.</Highlight>
            </Hero>
            <div className={styles.heroNote}>
              <Check size={13} /> Your ideas. Your people. Your space.
            </div>
          </Reveal>
          <Reveal className={styles.previewWrap} delay={0.15}>
            <WorkspacePreview />
          </Reveal>
          <div className={styles.principles}>
            <span>
              <LayoutGrid size={15} /> A clearer view of work
            </span>
            <span>
              <Users size={15} /> Built for working together
            </span>
            <span>
              <ShieldCheck size={15} /> Thoughtfully simple
            </span>
          </div>
          <section
            id="features"
            className={styles.featureSection}
            aria-labelledby="features-title"
          >
            <Reveal>
              <div className={styles.sectionKicker}>
                <span /> The Kylro workspace
              </div>
              <SectionHead
                id="features-title"
                title={
                  <>
                    Everything you need.
                    <br />
                    <Highlight>Room to breathe.</Highlight>
                  </>
                }
              >
                From the first idea to the final checkmark,
                <br className={styles.desktopBreak} /> keep your people and your
                projects on the same page.
              </SectionHead>
            </Reveal>
            <FeatureBento className={styles.featureGrid}>
              {features.map(
                ({ icon: Icon, number, title, text, visual }, i) => (
                  <Reveal
                    key={number}
                    delay={(i % 2) * 0.08}
                    className={styles[`bento${visual}`]}
                  >
                    <Card className={styles.featureCard}>
                      <CardBody className={styles.featureBody}>
                        <div className={styles.featureTop}>
                          <span className={styles.featureIcon}>
                            <Icon size={19} />
                          </span>
                          <small>{number}</small>
                        </div>
                        <CardTitle>{title}</CardTitle>
                        <CardText className={styles.featureText}>
                          {text}
                        </CardText>
                        <FeatureVisual type={visual} />
                      </CardBody>
                    </Card>
                  </Reveal>
                ),
              )}
            </FeatureBento>
          </section>
          <section
            id="how-it-works"
            className={styles.howSection}
            aria-labelledby="how-title"
          >
            <Reveal>
              <div className={styles.sectionKicker}>
                <span /> From an idea to a little momentum
              </div>
              <SectionHead
                id="how-title"
                title={
                  <>
                    Good work starts <Highlight>right here.</Highlight>
                  </>
                }
              >
                A few simple steps. A little more space for what matters.
              </SectionHead>
            </Reveal>
            <div className={styles.steps}>
              {[
                {
                  title: "Make yourself a space",
                  description:
                    "Create a workspace for your team or your next big idea.",
                  icon: LayoutGrid,
                },
                {
                  title: "Bring everyone along",
                  description:
                    "Invite your people and give every project a shared home.",
                  icon: Users,
                },
                {
                  title: "Find your next step",
                  description:
                    "Create your first issue. Start small, keep moving.",
                  icon: ArrowUpRight,
                },
              ].map(({ title, description, icon: Icon }, i) => (
                <Reveal key={title} delay={i * 0.08} className={styles.step}>
                  <div className={styles.stepTop}>
                    <span>0{i + 1}</span>
                    <Icon size={19} />
                  </div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </Reveal>
              ))}
            </div>
          </section>
          <Reveal className={styles.closing}>
            <div className={styles.closingSymbol}>
              <Command size={26} />
            </div>
            <p>A little less noise. A little more possibility.</p>
            <h2>
              Make space for <Highlight>your best work.</Highlight>
            </h2>
            <span>Your next chapter starts with a workspace.</span>
            <Button asChild variant="solid" size="lg">
              <Link href="/signup">Let’s get started</Link>
            </Button>
            <a href="#preview" className={styles.backToPreview}>
              Take another look <ArrowDown size={12} />
            </a>
          </Reveal>
        </main>
        <Footer
          className={styles.footer}
          logo={<Brand />}
          owner="Kylro"
          tagline="A calmer way to work, together."
          sections={[
            {
              title: "Explore",
              links: [
                { label: "The workspace", href: "#features" },
                { label: "How it works", href: "#how-it-works" },
              ],
            },
            {
              title: "Your space",
              links: [
                { label: "Get started", href: "/signup" },
                { label: "Sign in", href: "/login" },
              ],
            },
          ]}
        />
      </div>
    </MotionConfig>
  );
}
