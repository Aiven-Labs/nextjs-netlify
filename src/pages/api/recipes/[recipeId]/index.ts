import type { NextApiRequest, NextApiResponse } from "next";
import prisma, {
  calculateFavoriteStats,
  calculateTotalStats,
} from "@/lib/prisma";
import { REDIS_RECIPE_STATS_KEY } from "@/constants";
import { createRedisInstance } from "@/lib/ioredis";
import { Recipe } from "@prisma/client";
import { ErrorResponse } from "@/types";

const redis = createRedisInstance();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Recipe | ErrorResponse>
) {
  const id = Number(req.query.recipeId);

  if (req.method === "GET") {
    const recipe = await prisma.recipe.findFirst({ where: { id } });

    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ message: "Recipe not found." });
    }

    return;
  }

  if (req.method === "PATCH") {
    const body = JSON.parse(req.body);
    const isFavorite = Boolean(body.isFavorite);

    const recipe = await prisma.recipe.update({
      where: { id },
      data: { isFavorite },
    });

    // If redis instance is available, update cache for favorite stats.
    if (redis?.status === "ready" || redis?.status === "connecting") {
      const recipeStatsCache = await redis.get(REDIS_RECIPE_STATS_KEY);
      let totalStats;

      if (recipeStatsCache) {
        ({ totalStats } = JSON.parse(recipeStatsCache));
      } else {
        totalStats = await calculateTotalStats();
      }

      const favoriteStats = await calculateFavoriteStats();

      await redis.set(
        REDIS_RECIPE_STATS_KEY,
        JSON.stringify({ totalStats, favoriteStats })
      );
    }

    if (!recipe) {
      res.status(404).json({ message: "Recipe not found." });
    }

    res.json(recipe);
    return;
  }

  res.status(405).json({ message: "Method not allowed." });
}
