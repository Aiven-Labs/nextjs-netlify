import { Redis } from "ioredis";

const REDIS_URI = process.env.REDIS_URI;

export const createRedisInstance = () => {
  if (!REDIS_URI) {
    console.warn(
      "Missing REDIS_URI environment variable. Results will not be cached."
    );
    return;
  }

  const redis = new Redis(REDIS_URI, {
    retryStrategy: () => null, // If connection fails, let's not try to reconnect automatically and spam errors.
  });

  redis.on("error", () => {
    console.warn(
      "Creating Redis instance failed. Results will not cached. Make sure your REDIS_URI environment variable points to a running Aiven for Redis® instance and restart your application."
    );
  });

  return redis;
};

export const getCachedDataFromRedis = async ({
  redis,
  key,
}: {
  redis: Redis;
  key: string;
}): Promise<{ result: string | null | undefined; executionTime: string }> => {
  return new Promise((resolve, reject) => {
    const startTime = process.hrtime();

    redis.get(key, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      const endTime = process.hrtime(startTime);
      const executionTime = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(
        2
      ); // Convert to milliseconds.

      console.log(
        `Cache retrieved from Redis in ${executionTime} milliseconds`
      );

      resolve({ result, executionTime });
    });
  });
};
