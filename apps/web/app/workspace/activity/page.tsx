import { Suspense } from "react";
import { WorkspaceActivity } from "../../../components/workspace/WorkspaceViews";
export default function Page() { return <Suspense fallback={<p>Loading…</p>}><WorkspaceActivity /></Suspense>; }
