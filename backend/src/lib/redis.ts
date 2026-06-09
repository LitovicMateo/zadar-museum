import Redis from 'ioredis';

const redis: Redis | null = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      lazyConnect: false,
    })
  : null;

if (redis) {
  redis.on('error', (err: Error) => {
    console.error('[redis] error:', err.message);
  });

  redis.on('connect', () => {
    console.info('[redis] connected');
  });
}

export default redis;
