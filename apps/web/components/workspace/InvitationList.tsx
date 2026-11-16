"use client";
import { useEffect, useState } from "react";
import { invitationApi, type WorkspaceInvitation } from "../../lib/workspace-api";
import { errorMessage } from "../../lib/project-api";
import { useWorkspace } from "./WorkspaceProvider";
import { useWorkspaceAction } from "./WorkspaceShell";
export function InvitationList() {
 const { data } = useWorkspace(); const action = useWorkspaceAction();
 const [now,setNow]=useState(0);
 const [items,setItems]=useState<WorkspaceInvitation[]>([]),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 const id=data?.workspace.id; const allowed=data && ["owner","admin"].includes(data.workspace.role);
 useEffect(()=>{if(!id||!allowed)return;let active=true;const load=()=>{invitationApi.list(id).then(rows=>{if(active){setNow(Date.now());setItems(rows);setError("");}}).catch(e=>{if(active)setError(errorMessage(e));});};load();const timer=setInterval(load,5000);return()=>{active=false;clearInterval(timer);};},[id,allowed]);
 async function change(item:WorkspaceInvitation,resend:boolean){if(!id)return;setBusy(true);setError("");try{if(resend)await invitationApi.send(id,item.email,item.role);else await invitationApi.revoke(id,item.id);setItems(await invitationApi.list(id));}catch(e){setError(errorMessage(e));}finally{setBusy(false);}}
 if(!allowed)return null;
 return <section className="ws-panel ws-padded" style={{marginTop:24}}><div className="ws-section-heading"><h2>Email invitations</h2><button className="ws-button" onClick={()=>action("invite")}>Invite member</button></div>{error&&<p role="alert" className="ws-error">{error}</p>}<div className="ws-table-wrap"><table className="ws-table"><thead><tr><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead><tbody>{items.map(item=><tr key={item.id}><td>{item.email}</td><td>{item.role}</td><td>{item.status==="pending"&&Date.parse(item.expiresAt)<now?"expired":item.status} · {item.deliveryStatus}</td><td>{item.status!=="accepted"&&(data!.workspace.role==="owner"||item.role!=="admin")&&<><button disabled={busy} className="ws-text-button" onClick={()=>void change(item,true)}>Resend</button>{item.status==="pending"&&<button disabled={busy} className="ws-text-button" style={{marginLeft:14}} onClick={()=>void change(item,false)}>Revoke</button>}</>}</td></tr>)}</tbody></table></div>{!items.length&&<p className="ws-muted">No invitations yet. Invite someone by email to join this workspace.</p>}</section>;
}
