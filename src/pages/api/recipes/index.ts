import { DEFAULT_PAGE_SIZE } from "@/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma, {
  calculateFavoriteStats,
  calculateTotalStats,
} from "@/lib/prisma";
import { createRedisInstance, getCachedDataFromRedis } from "@/lib/ioredis";
import { REDIS_RECIPE_STATS_KEY } from "@/constants";

const redis = createRedisInstance();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const page = Number(req.query.page) || 1;

    const recipes = await prisma.recipe.findMany({
      skip: DEFAULT_PAGE_SIZE * (page - 1),
      take: DEFAULT_PAGE_SIZE,
      // The dataset contains a lot of duplicate names, ratings etc. so this is needed to have the consistency in the results.
      orderBy: [
        { rating: "desc" },
        {
          recipeName: "asc",
        },
        {
          id: "desc",
        },
      ],
    });

    let totalStats: Awaited<ReturnType<typeof calculateTotalStats>>;
    let favoriteStats: Awaited<ReturnType<typeof calculateFavoriteStats>>;
    let recipeStatsCacheRetrievalTimeMs;

    // If Redis is available, retrieve cache for recipe stats and update the cache if it has not been populated.
    // Sometimes the redis instance might have a status of "connecting", which still allows querying the database.
    if (redis?.status === "ready" || redis?.status === "connecting") {
      const {
        result: recipeStatsCache,
        executionTime: totalStatsExecutionTime,
      } = await getCachedDataFromRedis({
        redis,
        key: REDIS_RECIPE_STATS_KEY,
      });

      if (!recipeStatsCache) {
        totalStats = await calculateTotalStats();
        favoriteStats = await calculateFavoriteStats();

        await redis.set(
          REDIS_RECIPE_STATS_KEY,
          JSON.stringify({ totalStats, favoriteStats })
        );
      } else {
        recipeStatsCacheRetrievalTimeMs = totalStatsExecutionTime;
        ({ totalStats, favoriteStats } = JSON.parse(recipeStatsCache));
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

    const totalPages = Math.ceil(totalRecipesCount / DEFAULT_PAGE_SIZE);
    const resultsBeforeCurrentPage = DEFAULT_PAGE_SIZE * (page - 1);
    const resultsAfterCurrentPage =
      totalRecipesCount - resultsBeforeCurrentPage - DEFAULT_PAGE_SIZE;
    const hasPreviousPage = resultsBeforeCurrentPage > 0;
    const hasNextPage = resultsAfterCurrentPage > 0;

    res.json({
      statistics: {
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
        recipeStatsCacheRetrievalTimeMs,
      },
      recipes,
      page,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    });

    return;
  }

  res.status(405).json({ message: "Method not allowed." });
}
