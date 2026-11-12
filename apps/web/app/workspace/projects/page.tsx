import { Suspense } from "react";
import { WorkspaceProjects } from "../../../components/workspace/WorkspaceViews";
export default function Page() { return <Suspense fallback={<p>Loading…</p>}><WorkspaceProjects /></Suspense>; }
