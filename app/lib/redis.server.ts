import { createClient, RedisClientType } from 'redis';

let client: RedisClientType;

(async () => {
    client = createClient({
        url: 'redis://default:redis@127.0.0.1:6379'
    });

    client.on('error', (err: any) => console.log('Redis Client Error', err));

    await client.connect();
})();

export { client }