import type { NextAuthConfig } from "next-auth";
import Resend from "next-auth/providers/resend";

export default {
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/login/check-email",
  },
} satisfies NextAuthConfig;
