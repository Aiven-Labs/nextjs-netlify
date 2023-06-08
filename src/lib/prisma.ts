import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;

export const calculateFavoriteStats = async () => {
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

  return {
    favoriteRecipesCount,
    avgFavoriteServings: avgFavoriteServings?.toFixed(),
    avgFavoriteRating: avgFavoriteRating?.toFixed(2),
    avgFavoritePrepTimeMinutes: avgFavoritePrepTimeMinutes?.toFixed(),
    avgFavoriteCookTimeMinutes: avgFavoriteCookTimeMinutes?.toFixed(),
    avgFavoriteTotalTimeMinutes: avgFavoriteTotalTimeMinutes?.toFixed(),
  };
};

export const calculateTotalStats = async () => {
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

  return {
    totalRecipesCount,
    avgTotalServings: avgTotalServings?.toFixed(),
    avgTotalRating: avgTotalRating?.toFixed(2),
    avgTotalPrepTimeMinutes: avgTotalPrepTimeMinutes?.toFixed(),
    avgTotalCookTimeMinutes: avgTotalCookTimeMinutes?.toFixed(),
    avgTotalTotalTimeMinutes: avgTotalTotalTimeMinutes?.toFixed(),
  };
};
