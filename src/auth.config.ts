import type { NextAuthConfig } from 'next-auth';

/**
 * Edge-compatible auth config (no Prisma/bcrypt imports).
 * Used by middleware to check authentication without Node.js dependencies.
 */
export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isPublicPage =
                nextUrl.pathname.startsWith('/login') ||
                nextUrl.pathname.startsWith('/signup');

            if (isPublicPage) {
                return true;
            }

            return isLoggedIn;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    providers: [],
} satisfies NextAuthConfig;
