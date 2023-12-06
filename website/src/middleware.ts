import { NextRequest, NextResponse } from 'next/server';
import game_utils from '../utils/game_utils';

export async function middleware(req: NextRequest, res: NextResponse) {
    const cookies = req.headers.get('cookie');
    const token = cookies?.split(';').find((c: string) => c.trim().startsWith('token='))?.split('=')[1];
    const ip_address = req.headers.get('cf-connecting-ip');
    const url = req.nextUrl.clone();

    if (req.nextUrl.pathname.startsWith('/_next') || req.nextUrl.pathname.includes(".") || req.method != "GET") return NextResponse.next();

    if (token) {
        const response = await fetch(game_utils.origin + '/api/auth/validate', {
            method: 'POST',
            body: JSON.stringify({ token, ip_address }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // checks if it fetches html/page or asset

        if (response.status == 200 && url.pathname == '/') {
            url.pathname = '/home';
            return NextResponse.redirect(url);
        } else if (url.pathname == '/home' && response.status != 200) {
            url.pathname = '/';
            return NextResponse.redirect(url);
        }
    } else if (url.pathname != '/') {
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}
