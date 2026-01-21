import type { NextAuthConfig } from "next-auth";
import Resend from "next-auth/providers/resend";
import { sendVerificationRequest } from "./lib/email";

export default {
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      sendVerificationRequest,
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/login/check-email",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // After sign in, always go through our callback handler
      // This handles PWA redirect logic
      if (url.startsWith(baseUrl)) {
        // Internal URL - route through callback
        const targetUrl = url.replace(baseUrl, "");
        // Don't redirect callback to itself
        if (targetUrl.startsWith("/auth/callback")) {
          return url;
        }
        return `${baseUrl}/auth/callback?callbackUrl=${encodeURIComponent(targetUrl || "/dashboard")}`;
      }
      // External URL - just use it
      return url;
    },
  },
} satisfies NextAuthConfig;
