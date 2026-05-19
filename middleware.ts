import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import getCentralSession from "@/app/api/auth/central-session";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const ipAddress =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("socket.remoteAddress");
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const response = await getCentralSession({
    method: "POST",
    headers,
    body: JSON.stringify({
      ipAddress:
        process.env.NODE_ENV === "development"
          ? process.env.LOCALHOST_IP
          : ipAddress,
    }),
    cache: "no-store",
  });
  // console.log(response);
  if (response.status !== "SUCCESS" || response.session?.status !== "VALID") {
     console.log("SESSION INVALID IN middleware.ts:", response);
     console.log("Redirecting to central sign-in page...", ipAddress);
    return NextResponse.redirect(process.env.CENTRAL_SIGNIN_URL as string);
  }
  else{
      console.log("SESSION VALID IN middleware.ts:", response);
  }
}

// See "Matching Paths" below to learn more
// export const config = {
//   matcher: "/:path*",
// };
