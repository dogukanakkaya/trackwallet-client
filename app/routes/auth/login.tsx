import { ActionFunction, json } from 'remix';
import { auth } from '../../lib/firebase/firebase.server';
import { auth as authCookie } from '../../lib/cookie';

export const action: ActionFunction = async ({ request }) => {
    const { token } = await request.json();

    const expiresIn = 60 * 60 * 8 * 1000; // 8 hour

    const sessionCokie = await auth.createSessionCookie(token, { expiresIn });
    const user = await auth.verifySessionCookie(sessionCokie, true);

    return json({
        status: true,
        data: user
    }, {
        headers: {
            'Set-Cookie': await authCookie.serialize({ token: sessionCokie })
        }
    });
};