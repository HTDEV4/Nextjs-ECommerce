import arcjet, { protectSignup, validateEmail } from "@arcjet/next";

export const protectSignupRules = arcjet({
    key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
    rules: [
        protectSignup({
            email: {
                mode: "LIVE",
                block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
            },
            bots: {
                mode: "LIVE",
                allow: [],
            },
            rateLimit: {
                mode: "LIVE",
                interval: "10m",
                max: 5,
            },
        }),
    ],
});

export const protectLoginRules = arcjet({
    key: process.env.ARCJET_KEY!,
    rules: [
        validateEmail({
            mode: "LIVE",
            deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
        }),
    ],
});