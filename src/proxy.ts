import { NextRequest, NextResponse } from 'next/server';

const MOBILE_UA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|mobile/i;

function isMobileRequest(request: NextRequest) {
  const ua = request.headers.get('user-agent') || '';
  const chUaMobile = request.headers.get('sec-ch-ua-mobile') || '';
  return chUaMobile === '?1' || MOBILE_UA.test(ua);
}

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = url;
  const isMobile = isMobileRequest(req);

  if (pathname === '/') {
    url.pathname = isMobile ? '/home' : '/landing';
    return NextResponse.redirect(url);
  }

  if (pathname === '/landing' && isMobile) {
    url.pathname = '/home';
    return NextResponse.redirect(url);
  }

  if (!isMobile && pathname !== '/landing') {
    url.pathname = '/landing';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sw.js).*)'],
};
