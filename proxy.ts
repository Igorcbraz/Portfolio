import { NextRequest, NextResponse } from "next/server"

export const locales = ["en", "pt"]
export const defaultLocale = "en"

function getLocale(request: NextRequest) {
  const acceptLanguageHeader = request.headers.get("accept-language")
  if (acceptLanguageHeader) {
    const preferredLanguages = acceptLanguageHeader.split(',').map(lang => lang.split(';')[0].trim())
    for (const lang of preferredLanguages) {
      if (locales.includes(lang.split('-')[0])) {
        return lang.split('-')[0]
      }
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
    "/((?!_next|.*\..*).*)",
  ],
}
