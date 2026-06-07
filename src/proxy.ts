// In next-auth v5, exporting `auth` as the proxy handler causes it to:
// 1. Read the JWT session cookie from each incoming request
// 2. Run the `authorized` callback defined in src/auth.ts
// 3. Automatically redirect to pages.signIn when authorized returns false
import { auth } from "@/auth";

export { auth as proxy };

export const config = {
  matcher: ["/admin/:path*"],
};
