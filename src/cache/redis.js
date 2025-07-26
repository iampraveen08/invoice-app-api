import { createClient } from 'redis';
import config from '../config/env.js';

let client;

export const getRedis = async () => {
    if (!config.redisUrl) return null;
    if (!client) {
        client = createClient({ url: config.redisUrl });
        client.on('error', (err) => console.error('Redis error', err));
        await client.connect();
    }
    return client;
};
