import { NextRequest, NextResponse } from 'next/server';

const BLOCKED_EMAILS = ['marianapulgarin@howdy.com', 'katie@howdy.com', 'jackie@howdy.com', 'lucianovarini@howdy.com'];

export async function POST(request: NextRequest) {
    try {
        const { accessToken } = await request.json();
        
        if (!accessToken) {
            return NextResponse.json({ error: 'Missing access token' }, { status: 400 });
        }

        const googleResponse = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`);
        
        if (!googleResponse.ok) {
            return NextResponse.json({ error: 'Invalid Google token' }, { status: 401 });
        }
        
        const userInfo = await googleResponse.json();
        
        if (!userInfo.id || !userInfo.email) {
            return NextResponse.json({ error: 'Invalid user data from Google' }, { status: 401 });
        }

        if (!userInfo.email.endsWith('@howdy.com') || BLOCKED_EMAILS.includes(userInfo.email)) {
            return NextResponse.json({ error: 'Only Howdy employees can access this system' }, { status: 403 });
        }

        const user = {
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            googleId: userInfo.id
        };

        return NextResponse.json({ success: true, user });
        
    } catch (error) {
        console.error('Google auth error:', error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
}


