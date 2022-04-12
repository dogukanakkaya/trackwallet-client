import { api } from '../axios';

export const getUserFromRequest = async (request: Request) => {
    try {
        const { data: { data: user } } = await api.get('/auth/verify', {
            headers: {
                'Cookie': request.headers.get('Cookie') || '',
            }
        });

        return user;
    } catch (_) {
        return null;
    }
}