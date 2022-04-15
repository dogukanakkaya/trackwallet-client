import { api } from '../axios';

export const getUserFromRequest = async (request: Request) => {
    try {
        const { data: { data } } = await api.get('/auth/verify');

        return data.user;
    } catch (err) {
        return null;
    }
}