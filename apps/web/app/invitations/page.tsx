import { InvitationAcceptance } from "../../components/workspace/InvitationAcceptance";
import "../projects/[projectId]/project.css";
import "../workspace/workspace.css";
export const metadata={title:"Workspace invitation · Kylro",robots:{index:false,follow:false},referrer:"no-referrer" as const};
export default async function Page({searchParams}:{searchParams:Promise<{token?:string}>}){const {token}=await searchParams;return <InvitationAcceptance token={token||""}/>;}
