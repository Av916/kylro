import { VerifyMagicLink } from "../../../components/auth/VerifyMagicLink";

export const metadata = {
    title: "Verify sign-in link - Klyro",
};

export default async function VerifyPage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string | string[] }>;
}) {
    const { token } = await searchParams;
    return <VerifyMagicLink token={typeof token === "string" ? token : ""} />;
}
