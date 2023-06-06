import { DEFAULT_PAGE_SIZE } from "@/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

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

    const {
      _count: totalRecipesCount,
      _avg: {
        servings: avgTotalServings,
        rating: avgTotalRating,
        prepTimeMinutes: avgTotalPrepTimeMinutes,
        cookTimeMinutes: avgTotalCookTimeMinutes,
        totalTimeMinutes: avgTotalTotalTimeMinutes,
      },
    } = await prisma.recipe.aggregate({
      _count: true,
      _avg: {
        servings: true,
        rating: true,
        prepTimeMinutes: true,
        cookTimeMinutes: true,
        totalTimeMinutes: true,
      },
    });

    const {
      _count: favoriteRecipesCount,
      _avg: {
        servings: avgFavoriteServings,
        rating: avgFavoriteRating,
        prepTimeMinutes: avgFavoritePrepTimeMinutes,
        cookTimeMinutes: avgFavoriteCookTimeMinutes,
        totalTimeMinutes: avgFavoriteTotalTimeMinutes,
      },
    } = await prisma.recipe.aggregate({
      _count: true,
      _avg: {
        servings: true,
        rating: true,
        prepTimeMinutes: true,
        cookTimeMinutes: true,
        totalTimeMinutes: true,
      },
      where: {
        isFavorite: true,
      },
    });

    const totalPages = Math.ceil(totalRecipesCount / DEFAULT_PAGE_SIZE);
    const resultsBeforeCurrentPage = DEFAULT_PAGE_SIZE * (page - 1);
    const resultsAfterCurrentPage =
      totalRecipesCount - resultsBeforeCurrentPage - DEFAULT_PAGE_SIZE;
    const hasPreviousPage = resultsBeforeCurrentPage > 0;
    const hasNextPage = resultsAfterCurrentPage > 0;

    res.json({
      recipes,
      totalRecipesCount,
      favoriteRecipesCount,
      avgTotalServings: avgTotalServings?.toFixed(),
      avgFavoriteServings: avgFavoriteServings?.toFixed(),
      avgTotalRating: avgTotalRating?.toFixed(2),
      avgFavoriteRating: avgFavoriteRating?.toFixed(2),
      avgTotalPrepTimeMinutes: avgTotalPrepTimeMinutes?.toFixed(),
      avgFavoritePrepTimeMinutes: avgFavoritePrepTimeMinutes?.toFixed(),
      avgTotalCookTimeMinutes: avgTotalCookTimeMinutes?.toFixed(),
      avgFavoriteCookTimeMinutes: avgFavoriteCookTimeMinutes?.toFixed(),
      avgTotalTotalTimeMinutes: avgTotalTotalTimeMinutes?.toFixed(),
      avgFavoriteTotalTimeMinutes: avgFavoriteTotalTimeMinutes?.toFixed(),
      page,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    });

    return;
  }

  res.status(405).json({ message: "Method not allowed." });
}
