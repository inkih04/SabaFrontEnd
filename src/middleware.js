import { NextResponse } from 'next/server'

export function middleware(request) {
    // Obtener el token de las cookies o headers
    const token = request.cookies.get('token')?.value ||
        request.headers.get('authorization')

    const { pathname } = request.nextUrl

    // Si no tiene token y no está en login, redirigir a login
    if (!token && pathname !== '/login') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}