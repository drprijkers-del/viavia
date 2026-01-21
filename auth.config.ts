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
  // Cookie settings for PWA session sharing
  // Cookies set on the domain work in both browser and PWA standalone mode
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
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
      // After sign in from magic link, go to success page
      if (url.startsWith(baseUrl)) {
        const targetUrl = url.replace(baseUrl, "");
        // Don't redirect success page to itself
        if (targetUrl.startsWith("/auth/success")) {
          return url;
        }
        // After login, always show success page first
        // The success page will guide user to open PWA
        return `${baseUrl}/auth/success`;
      }
      return url;
    },
  },
} satisfies NextAuthConfig;
