import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  /*
   * Ignore: Set prisma to the global object to prevent serverless functions from creating excessive amounts of DB connections.
   * However, we don't want to type the global namespace to contain the Prisma instance since we always want to import it from here.
   */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!global.prisma) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global.prisma = new PrismaClient();
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
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
    avgFavoriteServings: Number(avgFavoriteServings?.toFixed()) ?? 0,
    avgFavoriteRating: Number(avgFavoriteRating?.toFixed(2)) ?? 0,
    avgFavoritePrepTimeMinutes: Number(avgFavoritePrepTimeMinutes?.toFixed()) ?? 0,
    avgFavoriteCookTimeMinutes: Number(avgFavoriteCookTimeMinutes?.toFixed()) ?? 0,
    avgFavoriteTotalTimeMinutes: Number(avgFavoriteTotalTimeMinutes?.toFixed()) ?? 0,
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
    avgTotalServings: Number(avgTotalServings?.toFixed()) ?? 0,
    avgTotalRating: Number(avgTotalRating?.toFixed(2)) ?? 0,
    avgTotalPrepTimeMinutes: Number(avgTotalPrepTimeMinutes?.toFixed()) ?? 0,
    avgTotalCookTimeMinutes: Number(avgTotalCookTimeMinutes?.toFixed()) ?? 0,
    avgTotalTotalTimeMinutes: Number(avgTotalTotalTimeMinutes?.toFixed()) ?? 0,
  };
};
