import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    providers: [],
    pages: {
        signIn: "/admin/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAdminRoute = nextUrl.pathname.startsWith("/admin");
            const isAuthRoute = nextUrl.pathname.startsWith("/admin/login");

            if (isAdminRoute) {
                if (isLoggedIn) {
                    if (isAuthRoute) return Response.redirect(new URL("/admin", nextUrl));
                    return true;
                }
                if (!isAuthRoute) return false;
                return true;
            }
            return true;
        },
    },
} satisfies NextAuthConfig;
