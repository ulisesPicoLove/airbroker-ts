import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Rutas protegidas (requieren autenticación)
  const protectedRoutes = ["/dashboard", "/profile", "/protected"];

  // Rutas de autenticación (no deberían ser accesibles si hay sesión)
  const authRoutes = ["/login", "/signup"];

  if (!token) {
    // Usuario no autenticado, redirigir si intenta acceder a rutas protegidas
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } else {
    // Usuario autenticado, redirigir si intenta acceder a login/signup
    if (authRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Permitir el acceso a otras rutas
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", // Rutas protegidas
    "/login", // Página de login
    "/signup", // Página de registro
  ],
};
