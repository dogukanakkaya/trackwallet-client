import { api } from '../axios';

// maybe cache the user object
export const getUserFromRequest = async (request: Request) => {
    const { data: { data: user } } = await api.get('/auth/verify', {
        headers: {
            'Cookie': request.headers.get('Cookie') || '',
        }
    });

    return user;
}