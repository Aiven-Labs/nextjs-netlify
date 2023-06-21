import type { NextApiRequest, NextApiResponse } from 'next';

import { REDIS_RECIPE_STATS_KEY } from '@/constants';
import redis from '@/lib/ioredis';
import { calculateFavoriteStats, calculateTotalStats } from '@/lib/prisma';
import { ErrorResponse, RecipeStatsResponse } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse<ErrorResponse | RecipeStatsResponse>) {
  if (req.method === 'GET') {
    let totalStats: Awaited<ReturnType<typeof calculateTotalStats>>;
    let favoriteStats: Awaited<ReturnType<typeof calculateFavoriteStats>>;
    let endToEndRetrievalTimeMs;

    try {
      /*
       * If Redis is available, retrieve cache for recipe stats and update the cache if it has not been populated.
       * Sometimes the redis instance might have a status of "connecting", which still allows querying the database.
       */
      if (redis?.status === 'ready' || redis?.status === 'connecting') {
        const startTime = process.hrtime();
        const cache = await redis.get(REDIS_RECIPE_STATS_KEY);

        if (!cache) {
          totalStats = await calculateTotalStats();
          favoriteStats = await calculateFavoriteStats();

          await redis.set(REDIS_RECIPE_STATS_KEY, JSON.stringify({ totalStats, favoriteStats }));
        } else {
          const endTime = process.hrtime(startTime);

          endToEndRetrievalTimeMs = Number((endTime[0] * 1000 + endTime[1] / 1000000).toFixed(2));
          ({ totalStats, favoriteStats } = JSON.parse(cache));
        }
      } else {
        totalStats = await calculateTotalStats();
        favoriteStats = await calculateFavoriteStats();
      }

      const {
        totalRecipesCount,
        avgTotalServings,
        avgTotalRating,
        avgTotalPrepTimeMinutes,
        avgTotalCookTimeMinutes,
        avgTotalTotalTimeMinutes,
      } = totalStats;

      const {
        favoriteRecipesCount,
        avgFavoriteServings,
        avgFavoriteRating,
        avgFavoritePrepTimeMinutes,
        avgFavoriteCookTimeMinutes,
        avgFavoriteTotalTimeMinutes,
      } = favoriteStats;

      res.json({
        total: {
          totalRecipesCount,
          avgTotalServings,
          avgTotalRating,
          avgTotalPrepTimeMinutes,
          avgTotalCookTimeMinutes,
          avgTotalTotalTimeMinutes,
        },
        favorite: {
          favoriteRecipesCount,
          avgFavoriteServings,
          avgFavoriteRating,
          avgFavoritePrepTimeMinutes,
          avgFavoriteCookTimeMinutes,
          avgFavoriteTotalTimeMinutes,
        },
        endToEndRetrievalTimeMs,
      });
    } catch {
      res.status(500).json({ message: 'Failed to load recipe stats.' });
    }

    return;
  }

  res.status(405).json({ message: 'Method not allowed.' });
}
