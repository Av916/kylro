import { Suspense } from "react";
import { WorkspaceSettings } from "../../../components/workspace/WorkspaceViews";
export default function Page() { return <Suspense fallback={<p>Loading…</p>}><WorkspaceSettings /></Suspense>; }
