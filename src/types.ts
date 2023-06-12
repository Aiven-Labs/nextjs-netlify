import { Recipe } from "@prisma/client";

export type ErrorResponse = { message: string };

export interface RecipesResponse {
  statistics: {
    total: {
      totalRecipesCount: number;
      avgTotalServings: number;
      avgTotalRating: number;
      avgTotalPrepTimeMinutes: number;
      avgTotalCookTimeMinutes: number;
      avgTotalTotalTimeMinutes: number;
    };
    favorite: {
      favoriteRecipesCount: number;
      avgFavoriteServings: number;
      avgFavoriteRating: number;
      avgFavoritePrepTimeMinutes: number;
      avgFavoriteCookTimeMinutes: number;
      avgFavoriteTotalTimeMinutes: number;
    };
    recipeStatsCacheRetrievalTimeMs?: string;
  };
  recipes: Recipe[];
  page: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
