import { client } from '../redis.server';

// TODO: explore and use client.json later
export const withCache = async <T>(key: string, callback: () => Promise<T>, options?: SetOptions): Promise<T> => {
    let data = await client.get(key);

    if (!data) {
        const data = await callback();

        await client.set(key, JSON.stringify(data), options);

        return data;
    } else {
        return JSON.parse(data);
    }
}

interface SetOptions {
    EX?: number;
}