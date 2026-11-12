import { Suspense } from "react";
import { WorkspaceIssues } from "../../../components/workspace/WorkspaceViews";
export default function Page() { return <Suspense fallback={<p>Loading…</p>}><WorkspaceIssues /></Suspense>; }
