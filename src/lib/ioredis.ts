import { Redis } from 'ioredis';

const REDIS_URI = process.env.REDIS_URI;

const createRedisInstance = () => {
  if (!REDIS_URI) {
    // eslint-disable-next-line no-console
    console.warn('Missing REDIS_URI environment variable. Results will not be cached.');
    return;
  }

  const redis = new Redis(REDIS_URI, {
    retryStrategy: () => null, // If connection fails, let's not try to reconnect automatically and spam errors.
  });

  redis.on('error', () => {
    // eslint-disable-next-line no-console
    console.warn(
      'Creating Redis instance failed. Results will not cached. Make sure your REDIS_URI environment variable points to a running Aiven for Redis® instance and restart your application.',
    );
  });

  return redis;
};

const redis = createRedisInstance();

export default redis;
