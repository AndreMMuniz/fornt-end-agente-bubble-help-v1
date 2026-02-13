import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

/**
 * Middleware uses the edge-compatible auth config only.
 * No Prisma or bcrypt imports here — those break the Edge Runtime.
 */
export default NextAuth(authConfig).auth;

export const config = {
    matcher: [
        '/((?!api/auth|api/register|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)',
    ],
};
