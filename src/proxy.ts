import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["tr", "en"];
const defaultLocale = "tr";

function getLocale(request: NextRequest): string {
  const acceptLang = request.headers.get("accept-language") || "";
  if (acceptLang.toLowerCase().includes("en")) return "en";
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  );

  if (hasLocale) return;

  const locale = getLocale(request);
  const target = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  request.nextUrl.pathname = target;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)" ],
};
