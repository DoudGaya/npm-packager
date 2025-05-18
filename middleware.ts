import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get the token
  const token = await getToken({ req: request })
  const isAuthenticated = !!token

  // Auth routes - redirect to dashboard if already authenticated
  if (
    isAuthenticated &&
    (pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/reset-password" ||
      pathname === "/verify-email" ||
      pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Public routes that don't require authentication
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/verify-email") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname.startsWith("/features") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/docs")
  ) {
    return NextResponse.next()
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(pathname))
    return NextResponse.redirect(url)
  }

  // Admin routes check
  if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
}


// import { NextResponse } from "next/server"
// import { getToken } from "next-auth/jwt"
// import type { NextRequest } from "next/server"

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl

//   // Public routes that don't require authentication
//   if (
//     pathname === "/" ||
//     pathname.startsWith("/login") ||
//     pathname.startsWith("/register") ||
//     pathname.startsWith("/reset-password") ||
//     pathname.startsWith("/verify-email") ||
//     pathname.startsWith("/api/auth") ||
//     pathname.startsWith("/_next") ||
//     pathname.includes(".")
//   ) {
//     return NextResponse.next()
//   }

//   const token = await getToken({ req: request })

//   // If user is not authenticated, redirect to login
//   if (!token) {
//     const url = new URL("/login", request.url)
//     url.searchParams.set("callbackUrl", encodeURI(pathname))
//     return NextResponse.redirect(url)
//   }

//   // Admin routes check
//   if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
//     return NextResponse.redirect(new URL("/dashboard", request.url))
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
// }
