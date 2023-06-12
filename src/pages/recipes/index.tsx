import { Layout } from "@/components/Layout/Layout";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { ErrorResponse, RecipesResponse } from "@/types";
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
    data,
    isLoading,
    error,
    mutate: refetchRecipes,
  } = useSWR<RecipesResponse, ErrorResponse>(
    `/api/recipes?page=${page}`,
    fetcher
  );

  const rows =
    data?.recipes.map(
      ({ id, recipeName, rating, totalTimeMinutes, isFavorite }) => ({
        id,
        recipeName,
        rating,
        totalTime: formatTimeMinutes(totalTimeMinutes),
        isFavorite,
      })
    ) ?? [];

  const statistics = data?.statistics;

  useEffect(() => {
    if (data?.page) {
      setPage(data.page);
    }
  }, [data?.page]);

  if (error) {
    return <EmptyState title={error.message ?? "Failed to load recipes."} />;
  }

  return (
    <Layout>
      <PageHeader
        title="Statistics"
        subtitle={
          statistics?.recipeStatsCacheRetrievalTimeMs
            ? `Recipe statistics cached in Aiven for Redis®, retrieved in ${statistics.recipeStatsCacheRetrievalTimeMs}ms (end-to-end with round
          trip, results will vary depending on the region of your Aiven
          for Redis® instance).`
            : "Recipe statistics retrieved from PostgreSQL database. To get cached results using Aiven for Redis®, please follow the instructions to set up your Redis instance."
        }
      />
      {data && (
        <Box.Flex justifyContent="space-between" gap="5" className="flex-wrap">
          <RecipeCard>
            <Section title="Recipe statistics">
              <Box.Flex flexDirection="column" gap="5">
                <Typography.SmallStrong>Recipes</Typography.SmallStrong>
                <Box.Flex flexDirection="column" gap="2">
                  <Box.Flex justifyContent="space-between">
                    <Typography.Small>All recipes</Typography.Small>
                    <Typography.Small>
                      {statistics?.total.totalRecipesCount}
                    </Typography.Small>
                  </Box.Flex>
                  <Box.Flex justifyContent="space-between">
                    <Typography.Small>Favorite recipes</Typography.Small>
                    <Typography.Small>
                      {statistics?.favorite.favoriteRecipesCount}
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
                      {statistics?.total.avgTotalServings}
                    </Typography.Small>
                  </Box.Flex>
                  <Box.Flex justifyContent="space-between">
                    <Typography.Small>From favorite recipes</Typography.Small>
                    <Typography.Small>
                      {statistics?.favorite.avgFavoriteServings}
                    </Typography.Small>
                  </Box.Flex>
                </Box.Flex>
                <Divider />
                <Typography.SmallStrong>Average rating</Typography.SmallStrong>
                <Box.Flex flexDirection="column" gap="2">
                  <Box.Flex justifyContent="space-between">
                    <Typography.Small>From all recipes</Typography.Small>
                    <Typography.Small>
                      {statistics?.total.avgTotalRating}
                    </Typography.Small>
                  </Box.Flex>
                  <Box.Flex justifyContent="space-between">
                    <Typography.Small>From favorite recipes</Typography.Small>
                    <Typography.Small>
                      {statistics?.favorite.avgFavoriteRating}
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
                        data.statistics.total.avgTotalPrepTimeMinutes
                      )}
                    </Typography.Small>
                  </Box.Flex>
                  <Box.Flex justifyContent="space-between">
                    <Typography.Small>From favorite recipes</Typography.Small>
                    <Typography.Small>
                      {formatTimeMinutes(
                        data.statistics.favorite.avgFavoritePrepTimeMinutes
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
                        data.statistics.total.avgTotalCookTimeMinutes
                      )}
                    </Typography.Small>
                  </Box.Flex>
                  <Box.Flex justifyContent="space-between">
                    <Typography.Small>From favorite recipes</Typography.Small>
                    <Typography.Small>
                      {formatTimeMinutes(
                        data.statistics.favorite.avgFavoriteCookTimeMinutes
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
                        data.statistics.total.avgTotalTotalTimeMinutes
                      )}
                    </Typography.Small>
                  </Box.Flex>
                  <Box.Flex justifyContent="space-between">
                    <Typography.Small>From favorite recipes</Typography.Small>
                    <Typography.Small>
                      {formatTimeMinutes(
                        data.statistics.favorite.avgFavoriteTotalTimeMinutes
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
        subtitle="A list of recipes retrieved form a Aiven for PostgreSQL® database."
      />
      {isLoading ? (
        <DataTable.Skeleton columns={4} rows={10} />
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
                      onSuccess: refetchRecipes,
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
      {data && (
        <Pagination
          currentPage={page}
          hasNextPage={data.hasNextPage}
          hasPreviousPage={data.hasPreviousPage}
          onPageChange={(page) => setPage(page)}
          pageSize={DEFAULT_PAGE_SIZE}
          totalPages={data.totalPages}
        />
      )}
    </Layout>
  );
}
