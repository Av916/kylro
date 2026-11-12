import { VerifyMagicLink } from "../../../components/auth/VerifyMagicLink";

export const metadata = {
    title: "Verify sign-in link - Klyro",
};

export default async function VerifyPage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string | string[]; next?: string | string[] }>;
}) {
    const { token, next } = await searchParams;
    return <VerifyMagicLink next={typeof next === "string" ? next : undefined} token={typeof token === "string" ? token : ""} />;
}
