import { Recipe } from '@prisma/client';

import type { NextApiRequest, NextApiResponse } from 'next';

import { REDIS_RECIPE_STATS_KEY } from '@/constants';
import redis from '@/lib/ioredis';
import prisma, { calculateFavoriteStats, calculateTotalStats } from '@/lib/prisma';
import { ErrorResponse } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse<ErrorResponse | Recipe>) {
  const id = Number(req.query.recipeId);

  if (req.method === 'GET') {
    try {
      const recipe = await prisma.recipe.findFirst({ where: { id } });

      if (recipe) {
        res.json(recipe);
      } else {
        res.status(404).json({ message: 'Recipe not found.' });
      }

      return;
    } catch {
      res.status(500).json({ message: 'Failed to fetch recipe.' });
      return;
    }
  }

  if (req.method === 'PATCH') {
    const body = JSON.parse(req.body);
    const isFavorite = Boolean(body.isFavorite);

    try {
      const recipe = await prisma.recipe.update({
        where: { id },
        data: { isFavorite },
      });

      // If redis instance is available, update cache for favorite stats.
      if (redis?.status === 'ready' || redis?.status === 'connecting') {
        const recipeStatsCache = await redis.get(REDIS_RECIPE_STATS_KEY);
        let totalStats;

        if (recipeStatsCache) {
          ({ totalStats } = JSON.parse(recipeStatsCache));
        } else {
          totalStats = await calculateTotalStats();
        }

        const favoriteStats = await calculateFavoriteStats();

        await redis.set(REDIS_RECIPE_STATS_KEY, JSON.stringify({ totalStats, favoriteStats }));
      }

      if (!recipe) {
        res.status(404).json({ message: 'Recipe not found.' });
      }

      res.json(recipe);
      return;
    } catch {
      res.status(500).json({ message: 'Failed to update recipe.' });
      return;
    }
  }

  res.status(405).json({ message: 'Method not allowed.' });
}
