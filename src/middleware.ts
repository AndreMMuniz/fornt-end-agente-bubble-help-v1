export { auth as middleware } from '@/auth';

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api/auth (NextAuth routes)
         * - api/register (registration route)
         * - login page
         * - signup page
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         * - public assets
         */
        '/((?!api/auth|api/register|login|signup|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)',
    ],
};
