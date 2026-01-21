import type { NextAuthConfig } from "next-auth";
import Resend from "next-auth/providers/resend";

export default {
  providers: [
    Resend({
      from: process.env.EMAIL_FROM || "noreply@viavia.app",
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
  },
} satisfies NextAuthConfig;
