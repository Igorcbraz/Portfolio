import { NextRequest, NextResponse } from "next/server"
import { locales, defaultLocale } from "@/lib/locales"

function getLocale(request: NextRequest) {
  const acceptLanguageHeader = request.headers.get("accept-language")
  if (acceptLanguageHeader) {
    const preferredLanguages = acceptLanguageHeader.split(',').map(lang => lang.split(';')[0].trim())
    for (const lang of preferredLanguages) {
      const locale = lang.split('-')[0]
      if (locales.includes(locale as any)) return locale
    }
  }
  return defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|fonts|.*\\..*).*)",
  ],
}
