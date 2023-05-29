import type { NextApiRequest, NextApiResponse } from 'next';

import { REDIS_RECIPE_STATS_KEY } from '@/constants';
import redis from '@/lib/ioredis';
import { calculateLikedStats, calculateTotalStats } from '@/lib/prisma';
import { ErrorResponse, RecipeStatsResponse } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse<ErrorResponse | RecipeStatsResponse>) {
  if (req.method === 'GET') {
    const startTime = process.hrtime();
    const useRedis = req.query.useRedis === 'true';

    let totalStats: Awaited<ReturnType<typeof calculateTotalStats>>;
    let likedStats: Awaited<ReturnType<typeof calculateLikedStats>>;
    let endToEndRetrievalTimeMs;
    let fromCache = false;

    const isRedisAvailable = redis?.status === 'ready' || redis?.status === 'connecting';

    try {
      /*
       * If Redis is available and enabled, retrieve cache for recipe stats and update the cache if it has not been populated.
       * Sometimes the redis instance might have a status of "connecting", which still allows querying the database.
       */
      if (redis && useRedis && isRedisAvailable) {
        const cache = await redis.get(REDIS_RECIPE_STATS_KEY);
        if (!cache) {
          totalStats = await calculateTotalStats();
          likedStats = await calculateLikedStats();

          await redis.set(REDIS_RECIPE_STATS_KEY, JSON.stringify({ totalStats, likedStats }));
        } else {
          ({ totalStats, likedStats } = JSON.parse(cache));
          fromCache = true;
        }
      } else {
        totalStats = await calculateTotalStats();
        likedStats = await calculateLikedStats();
      }

      const endTime = process.hrtime(startTime);
      endToEndRetrievalTimeMs = Number((endTime[0] * 1000 + endTime[1] / 1000000).toFixed(2));

      res.json({
        total: { ...totalStats },
        liked: { ...likedStats },
        endToEndRetrievalTimeMs,
        isRedisAvailable,
        fromCache,
      });
    } catch {
      res.status(500).json({ message: 'Failed to load recipe stats.' });
    }

    return;
  }

  res.status(405).json({ message: 'Method not allowed.' });
}
