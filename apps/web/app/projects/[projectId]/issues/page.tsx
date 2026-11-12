import { IssuesView } from "../../../../components/project/IssuesView";
export default async function ProjectIssuesPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
    const { q, status } = await searchParams;
    return <IssuesView key={`${q || ""}:${status || "all"}`} initialQuery={typeof q === "string" ? q : ""} initialStatus={typeof status === "string" ? status : "all"} />;
}
