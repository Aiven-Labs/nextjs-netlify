import { Layout } from "@/components/Layout/Layout";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { ErrorResponse, RecipeStatsResponse, RecipesResponse } from "@/types";
import fetcher from "@/lib/fetcher";
import {
  Box,
  DataTable,
  Divider,
  Link,
  PageHeader,
  Pagination,
  Section,
  Typography,
} from "@aivenio/aquarium";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import heart from "@aivenio/aquarium/icons/heart";
import trash from "@aivenio/aquarium/icons/trash";
import loading from "@aivenio/aquarium/icons/loading";
import { formatTimeMinutes } from "@/utils";
import { useAppContext } from "@/context";
import { useRecipes } from "@/hooks";
import { RecipeCard } from "@/components/RecipeCard/RecipeCard";

export default function Recipes() {
  const { addingRecipeIdToFavorites } = useAppContext();
  const { addRecipeToFavorites } = useRecipes();
  const [page, setPage] = useState(1);

  const {
    data: recipeStatsData,
    isLoading: recipeStatsLoading,
    error: recipeStatsError,
    mutate: refetchRecipeStats,
  } = useSWR<RecipeStatsResponse, ErrorResponse>("/api/recipes/stats", fetcher);

  const {
    data: recipesData,
    isLoading: recipesLoading,
    error: recipesError,
    mutate: refetchRecipes,
  } = useSWR<RecipesResponse, ErrorResponse>(
    `/api/recipes?page=${page}`,
    fetcher
  );

  const rows =
    recipesData?.recipes.map(
      ({ id, recipeName, rating, totalTimeMinutes, isFavorite }) => ({
        id,
        recipeName,
        rating,
        totalTime: formatTimeMinutes(totalTimeMinutes),
        isFavorite,
      })
    ) ?? [];

  useEffect(() => {
    if (recipesData?.page) {
      setPage(recipesData.page);
    }
  }, [recipesData?.page]);

  return (
    <Layout>
      <PageHeader
        title="Statistics"
        subtitle={
          recipeStatsData?.endToEndRetrievalTimeMs
            ? `Recipe statistics cached in Aiven for Redis®, retrieved in ${recipeStatsData.endToEndRetrievalTimeMs}ms (end-to-end with round
          trip between your serverless function and your database, results will vary depending on the region of your Aiven
          for Redis® instance).`
            : "Recipe statistics retrieved from PostgreSQL database. To get cached results using Aiven for Redis®, please follow the instructions to set up your Redis instance."
        }
      />
      {recipeStatsLoading ? (
        <DataTable.Skeleton columns={4} rows={7} />
      ) : recipeStatsError ? (
        <EmptyState
          title={recipeStatsError.message ?? "Failed to load recipe stats."}
          primaryAction={{
            onClick: refetchRecipeStats,
            text: "Refetch recipe stats",
          }}
        />
      ) : (
        <Box.Flex justifyContent="space-between" gap="5" className="flex-wrap">
          <RecipeCard>
            <Section title="Recipe statistics">
              <Box.Flex flexDirection="column" gap="5">
                <Typography.SmallStrong>Recipes</Typography.SmallStrong>
                <Box.Flex flexDirection="column" gap="2">
                  <Box.Flex justifyContent="space-between">
                    <Typography.Small>All recipes</Typography.Small>
                    <Typography.Small>
                      {recipeStatsData?.total.totalRecipesCount}
                    </Typography.Small>
                  </Box.Flex>
                  <Box.Flex justifyContent="space-between">
                    <Typography.Small>Favorite recipes</Typography.Small>
                    <Typography.Small>
                      {recipeStatsData?.favorite.favoriteRecipesCount}
                    </Typography.Small>
                  </Box.Flex>
                </Box.Flex>
                <Divider />
                <Typography.SmallStrong>
                  Average amount of servings
                </Typography.SmallStrong>
                <Box.Flex flexDirection="column" gap="2">
                  <Box.Flex justifyContent="space-between">
                    <Typography.Small>From all recipes</Typography.Small>
                    <Typography.Small>
                      {recipeStatsData?.total.avgTotalServings}
                    </Typography.Small>
                  </Box.Flex>
                  <Box.Flex justifyContent="space-between">
                    <Typography.Small>From favorite recipes</Typography.Small>
                    <Typography.Small>
                      {recipeStatsData?.favorite.avgFavoriteServings}
                    </Typography.Small>
                  </Box.Flex>
                </Box.Flex>
                <Divider />
                <Typography.SmallStrong>Average rating</Typography.SmallStrong>
                <Box.Flex flexDirection="column" gap="2">
                  <Box.Flex justifyContent="space-between">
                    <Typography.Small>From all recipes</Typography.Small>
                    <Typography.Small>
                      {recipeStatsData?.total.avgTotalRating}
                    </Typography.Small>
                  </Box.Flex>
                  <Box.Flex justifyContent="space-between">
                    <Typography.Small>From favorite recipes</Typography.Small>
                    <Typography.Small>
                      {recipeStatsData?.favorite.avgFavoriteRating}
                    </Typography.Small>
                  </Box.Flex>
                </Box.Flex>
              </Box.Flex>
            </Section>
          </RecipeCard>
          <RecipeCard>
            <Section title="Cooking time statistics">
              <Box.Flex flexDirection="column" gap="5">
                <Typography.SmallStrong>
                  Average preparation time
                </Typography.SmallStrong>
                <Box.Flex flexDirection="column" gap="2">
                  <Box.Flex justifyContent="space-between">
                    <Typography.Small>From all recipes</Typography.Small>
                    <Typography.Small>
                      {formatTimeMinutes(
                        recipeStatsData?.total.avgTotalPrepTimeMinutes
                      )}
                    </Typography.Small>
                  </Box.Flex>
                  <Box.Flex justifyContent="space-between">
                    <Typography.Small>From favorite recipes</Typography.Small>
                    <Typography.Small>
                      {formatTimeMinutes(
                        recipeStatsData?.favorite.avgFavoritePrepTimeMinutes
                      )}
                    </Typography.Small>
                  </Box.Flex>
                </Box.Flex>
                <Divider />
                <Typography.SmallStrong>
                  Average cooking time
                </Typography.SmallStrong>
                <Box.Flex flexDirection="column" gap="2">
                  <Box.Flex justifyContent="space-between">
                    <Typography.Small>From all recipes</Typography.Small>
                    <Typography.Small>
                      {formatTimeMinutes(
                        recipeStatsData?.total.avgTotalCookTimeMinutes
                      )}
                    </Typography.Small>
                  </Box.Flex>
                  <Box.Flex justifyContent="space-between">
                    <Typography.Small>From favorite recipes</Typography.Small>
                    <Typography.Small>
                      {formatTimeMinutes(
                        recipeStatsData?.favorite.avgFavoriteCookTimeMinutes
                      )}
                    </Typography.Small>
                  </Box.Flex>
                </Box.Flex>
                <Divider />
                <Typography.SmallStrong>
                  Average total cooking time
                </Typography.SmallStrong>
                <Box.Flex flexDirection="column" gap="2">
                  <Box.Flex justifyContent="space-between">
                    <Typography.Small>From all recipes</Typography.Small>
                    <Typography.Small>
                      {formatTimeMinutes(
                        recipeStatsData?.total.avgTotalTotalTimeMinutes
                      )}
                    </Typography.Small>
                  </Box.Flex>
                  <Box.Flex justifyContent="space-between">
                    <Typography.Small>From favorite recipes</Typography.Small>
                    <Typography.Small>
                      {formatTimeMinutes(
                        recipeStatsData?.favorite.avgFavoriteTotalTimeMinutes
                      )}
                    </Typography.Small>
                  </Box.Flex>
                </Box.Flex>
              </Box.Flex>
            </Section>
          </RecipeCard>
        </Box.Flex>
      )}
      <PageHeader
        title="All recipes"
        subtitle={`A list of recipes retrieved form a Aiven for PostgreSQL® database, retrieved in ${recipesData?.endToEndRetrievalTimeMs}ms (end-to-end with round
          trip between your serverless function and your database, results will vary depending on the region of your Aiven
          for PostgreSQL® instance).`}
      />
      {recipesLoading ? (
        <DataTable.Skeleton columns={4} rows={10} />
      ) : recipesError ? (
        <EmptyState
          title={recipesError.message ?? "Failed to load recipes."}
          primaryAction={{
            onClick: refetchRecipes,
            text: "Refetch recipes",
          }}
        />
      ) : (
        <Box style={{ overflowX: "auto" }}>
          <DataTable
            ariaLabel="All recipes"
            columns={[
              {
                field: "recipeName",
                headerName: "Recipe name",
                type: "custom",
                UNSAFE_render: (row) => (
                  <Link href={`/recipes/${row.id}`}>{row.recipeName}</Link>
                ),
              },
              {
                field: "rating",
                headerName: "Recipe rating",
                type: "text",
              },
              {
                field: "totalTime",
                headerName: "Total cooking time",
                type: "text",
              },
              {
                headerName: "Favorite",
                type: "action",
                action: (row) => ({
                  onClick: () =>
                    addRecipeToFavorites({
                      isFavorite: !row.isFavorite,
                      id: row.id,
                      onSuccess: () => {
                        refetchRecipeStats();
                        refetchRecipes();
                      },
                    }),
                  text: row.isFavorite ? "Remove favorite" : "Add to favorites",
                  icon:
                    addingRecipeIdToFavorites === row.id
                      ? loading
                      : row.isFavorite
                      ? trash
                      : heart,
                  disabled: addingRecipeIdToFavorites === row.id, // Aquarium does not support a loading state for this component - disable it for now.
                }),
              },
            ]}
            rows={rows}
          />
        </Box>
      )}
      {recipesData && (
        <Pagination
          currentPage={page}
          hasNextPage={recipesData.hasNextPage}
          hasPreviousPage={recipesData.hasPreviousPage}
          onPageChange={(page) => setPage(page)}
          pageSize={DEFAULT_PAGE_SIZE}
          totalPages={recipesData.totalPages}
        />
      )}
    </Layout>
  );
}
