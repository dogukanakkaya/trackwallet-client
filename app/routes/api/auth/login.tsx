import { ActionFunction, json } from 'remix';
import { auth, firestore } from '../../../lib/firebase/firebase.server';
import { auth as authCookie } from '../../../lib/cookie';

export const action: ActionFunction = async ({ request }) => {
    const { token } = await request.json();

    const expiresIn = 60 * 60 * 8 * 1000; // 8 hour

    try {
        const sessionCokie = await auth.createSessionCookie(token, { expiresIn });
        const user = await auth.verifySessionCookie(sessionCokie, true);

        const usersRef = firestore.collection('users');

        // check the user exists and create new if not
        const userByEmail = await usersRef.where('email', '==', user.email).get();

        if (userByEmail.size === 0) {
            await usersRef.doc(user.uid).set({
                name: user.name,
                email: user.email,
                picture: user.picture,
                sign_in_provider: user.firebase.sign_in_provider,
                email_verified: user.email_verified,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        return json({
            status: true,
            data: user
        }, {
            headers: {
                'Set-Cookie': await authCookie.serialize({ token: sessionCokie })
            }
        });
    } catch (err) {
        return json({
            status: false,
            data: { user: null }
        });
    }
};