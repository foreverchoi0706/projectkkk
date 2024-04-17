import { type NextRequest, NextResponse } from "next/server";

import { ACCESS_TOKEN } from "@/app/_utils/constants";

const middleware = (nextRequest: NextRequest) => {
  const hasAccessToken = nextRequest.cookies.has(ACCESS_TOKEN);

  const { pathname } = nextRequest.nextUrl;

  if (hasAccessToken) {
    if (["/", "/signIn"].includes(pathname)) {
      return NextResponse.redirect(new URL("/products", nextRequest.url));
    }
  } else {
    if (pathname !== "/signIn") {
      return NextResponse.redirect(
        new URL(
          `/signIn?callbackUrl=${encodeURIComponent(nextRequest.url)}`,
          nextRequest.url,
        ),
      );
    }
  }

  return NextResponse.next();
};

export default middleware;
export const config = {
  matcher: ["/signIn", "/members", "/products", "/"],
};
