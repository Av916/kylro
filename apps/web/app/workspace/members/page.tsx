import { Suspense } from "react";
import { WorkspaceMembers } from "../../../components/workspace/WorkspaceViews";
export default function Page() { return <Suspense fallback={<p>Loading…</p>}><WorkspaceMembers /></Suspense>; }
