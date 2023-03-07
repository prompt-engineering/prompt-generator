import { NextMiddleware, NextResponse } from "next/server";
import { SupportedLocales, getLocale, replaceRouteLocale, getLocaleFromPath, SupportedLocale } from "@/i18n";
import { SITE_LOCALE_COOKIE } from "@/configs/const";

export const middleware: NextMiddleware = (request) => {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = SupportedLocales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  let locale = getLocale(request.headers);

  const cookie = request.cookies.get(SITE_LOCALE_COOKIE);
  // If there is a cookie, and it is a supported locale, use it
  if (SupportedLocales.includes(cookie as any as SupportedLocale)) {
    locale = cookie as any as SupportedLocale;
  }

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(new URL(`/${locale}/${pathname}`, request.url));
  } else if (getLocaleFromPath(pathname) !== locale) {
    return NextResponse.redirect(new URL(replaceRouteLocale(pathname, locale), request.url));
  }
};

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next|favicon).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};