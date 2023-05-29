import { Recipe } from '@prisma/client';

export type ErrorResponse = { message: string };

export interface RecipesResponse {
  recipes: Recipe[];
  page: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  endToEndRetrievalTimeMs: number;
}

export interface RecipeStatsResponse {
  total: {
    totalRecipesCount: number;
    avgTotalServings: number;
    avgTotalRating: number;
    avgTotalPrepTimeMinutes: number;
    avgTotalCookTimeMinutes: number;
    avgTotalTotalTimeMinutes: number;
  };
  liked: {
    likedRecipesCount: number;
    avgLikedServings: number;
    avgLikedRating: number;
    avgLikedPrepTimeMinutes: number;
    avgLikedCookTimeMinutes: number;
    avgLikedTotalTimeMinutes: number;
  };
  endToEndRetrievalTimeMs: number;
  isRedisAvailable: boolean;
  fromCache: boolean;
}

export interface RecipeResponse {
  recipe: Recipe;
  endToEndRetrievalTimeMs: number;
}
