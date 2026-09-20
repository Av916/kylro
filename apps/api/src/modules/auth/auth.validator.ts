import { z } from "zod";

export const requestMagicLinkSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Please provide a valid email address"),
});

export const verifyMagicLinkSchema = z.object({
    token: z
        .string()
        .trim()
        .min(32, "Verification token is invalid")
        .max(128, "Verification token is invalid"),
});

export type RequestMagicLinkInput = z.infer<typeof requestMagicLinkSchema>;
export type VerifyMagicLinkInput = z.infer<typeof verifyMagicLinkSchema>;
