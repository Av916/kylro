import env from "../config/env.js";
import ApiError from "./ApiError.js";

interface SendMagicLinkOptions {
    toEmail: string;
    magicLink: string;
}

/**
 * Sends a transactional magic link email via the Brevo (Sendinblue) API.
 * In development, or if no API key is provided, the magic link is also
 * logged directly to the server console for seamless local development.
 */
export async function sendMagicLinkEmail({ toEmail, magicLink }: SendMagicLinkOptions): Promise<void> {
    // In local development, always print the magic link to console for developer convenience
    if (env.NODE_ENV === "development" || !env.BREVO_API_KEY) {
        console.log("\n============================================================");
        console.log(`🔑 [AUTH MAGIC LINK] Generated for: ${toEmail}`);
        console.log(`🔗 Verification Link: ${magicLink}`);
        console.log("============================================================\n");
    }

    if (!env.BREVO_API_KEY) {
        // If Brevo key isn't configured in development, early return after console logging
        if (env.NODE_ENV === "development") {
            return;
        }
        throw ApiError.internal("Email delivery service is not configured");
    }

    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "api-key": env.BREVO_API_KEY,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                sender: {
                    name: "Klyro",
                    email: env.EMAIL_FROM,
                },
                to: [
                    {
                        email: toEmail,
                    },
                ],
                subject: "Your Klyro Magic Sign-In Link",
                htmlContent: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Sign in to Klyro</title>
                        <style>
                            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #09090b; color: #f4f4f5; margin: 0; padding: 40px 20px; }
                            .card { max-width: 480px; margin: 0 auto; background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 32px; }
                            .logo { font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; margin-bottom: 24px; }
                            .heading { font-size: 20px; font-weight: 600; color: #ffffff; margin-bottom: 12px; }
                            .text { font-size: 14px; line-height: 1.6; color: #a1a1aa; margin-bottom: 24px; }
                            .button { display: inline-block; background-color: #3b82f6; color: #ffffff; font-weight: 500; font-size: 14px; text-decoration: none; padding: 12px 24px; border-radius: 6px; }
                            .footer { font-size: 12px; color: #71717a; margin-top: 32px; border-top: 1px solid #27272a; padding-top: 16px; }
                        </style>
                    </head>
                    <body>
                        <div class="card">
                            <div class="logo">Klyro</div>
                            <div class="heading">Sign in to your account</div>
                            <p class="text">Click the link below to securely sign in to Klyro. This link is single-use and will expire in 15 minutes.</p>
                            <a href="${magicLink}" class="button" target="_blank">Sign in to Klyro</a>
                            <p class="text" style="margin-top: 24px; font-size: 12px;">If you didn't request this link, you can safely ignore this email.</p>
                            <div class="footer">
                                If the button above doesn't work, copy and paste this URL into your browser:<br>
                                <span style="color: #3b82f6; word-break: break-all;">${magicLink}</span>
                            </div>
                        </div>
                    </body>
                    </html>
                `,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`[Brevo API Error ${response.status}]:`, errorBody);
            throw ApiError.internal("Failed to deliver magic link email");
        }
    } catch (err) {
        if (err instanceof ApiError) throw err;
        console.error("Failed to send transactional email:", err);
        throw ApiError.internal("Failed to deliver magic link email");
    }
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);

export async function sendInvitationEmail({ toEmail, workspaceName, role, invitationLink }: { toEmail: string; workspaceName: string; role: string; invitationLink: string }): Promise<void> {
    if (!env.BREVO_API_KEY) throw new ApiError(503, "Email delivery is not configured. Set BREVO_API_KEY and EMAIL_FROM before sending invitations.");
    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST", signal: AbortSignal.timeout(15000),
            headers: { "api-key": env.BREVO_API_KEY, "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
                sender: { name: "Kylro", email: env.EMAIL_FROM }, to: [{ email: toEmail }],
                subject: `Invitation to ${workspaceName} on Kylro`,
                textContent: `You have been invited to ${workspaceName} as a ${role}. Sign in with ${toEmail} to accept. This link expires in 7 days: ${invitationLink}`,
                htmlContent: `<html><body style="background:#f7f5ef;color:#252522;font-family:Arial,sans-serif;padding:32px"><div style="max-width:480px;margin:auto;padding:32px;background:#fcfbf7;border:1px solid #d9d6cd;border-radius:12px"><h2>Kylro</h2><h1 style="font-size:24px">Join ${escapeHtml(workspaceName)}</h1><p>You have been invited as a <strong>${escapeHtml(role)}</strong>.</p><p>Sign in with ${escapeHtml(toEmail)} to accept. Your invitation expires in 7 days.</p><p><a style="display:inline-block;padding:12px 18px;background:#252522;color:#fcfbf7;border-radius:7px;text-decoration:none" href="${escapeHtml(invitationLink)}">Review invitation</a></p><p style="font-size:12px;color:#77756d">If you weren't expecting this invitation, you can ignore this email.</p></div></body></html>`,
            }),
        });
        if (!response.ok) throw new ApiError(502, "The email provider could not deliver this invitation. Please try again later.");
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(502, "Invitation email delivery failed. Please try again later.");
    }
}
