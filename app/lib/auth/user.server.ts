import { auth as authCookie } from '../cookie';
import { auth } from '../firebase/firebase.server';

// maybe cache the user object
export const getUserFromRequest = async (request: Request) => {
    const cookieHeader = request.headers.get("Cookie");
    const cookies = await authCookie.parse(cookieHeader) || {};

    return auth.verifySessionCookie(cookies.token, true);
}