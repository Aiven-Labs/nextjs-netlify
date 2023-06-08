import { Layout } from "@/components/Layout/Layout";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { ErrorResponse } from "@/types";
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
import { Recipe } from "@prisma/client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import heart from "@aivenio/aquarium/icons/heart";
import trash from "@aivenio/aquarium/icons/trash";
import loading from "@aivenio/aquarium/icons/loading";
import { formatTimeMinutes } from "@/utils";
import { useAppContext } from "@/context";
import { useRecipes } from "@/hooks";

export default function Recipes() {
  const { addingRecipeIdToFavorites } = useAppContext();
  const { addRecipeToFavorites } = useRecipes();
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    error,
    mutate: refetchRecipes,
  } = useSWR<
    {
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
        recipeStatsCacheRetrievalTimeMs: string;
      };
      recipes: Recipe[];
      page: number;
      totalPages: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    },
    ErrorResponse
  >(`/api/recipes?page=${page}`, fetcher);

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
            ? `Recipe statistics cached in Aiven for Redis®, retrieved in ${statistics?.recipeStatsCacheRetrievalTimeMs}ms (end-to-end with round
          trip, results will vary depending on the region of your Aiven
          for Redis® instance).`
            : "Recipe statistics retrieved from PostgreSQL database. To get cached results using Aiven for Redis®, please follow the instructions to set up your Redis instance."
        }
      />
      {data && (
        <Box.Flex justifyContent="space-between" gap="5">
          <Box flex={1}>
            <Section title="Recipe statistics">
              <Box.Flex flexDirection="column" gap="5">
                <Typography variant="body-small" fontWeight={600}>
                  Recipes
                </Typography>
                <Box.Flex justifyContent="space-between">
                  <Typography variant="body-small">All recipes</Typography>
                  <Typography variant="body-small">
                    {statistics?.total.totalRecipesCount}
                  </Typography>
                </Box.Flex>
                <Box.Flex justifyContent="space-between">
                  <Typography variant="body-small">Favorite recipes</Typography>
                  <Typography variant="body-small">
                    {statistics?.favorite.favoriteRecipesCount}
                  </Typography>
                </Box.Flex>
                <Divider />
                <Typography variant="body-small" fontWeight={600}>
                  Average amount of servings
                </Typography>
                <Box.Flex justifyContent="space-between">
                  <Typography variant="body-small">From all recipes</Typography>
                  <Typography variant="body-small">
                    {statistics?.total.avgTotalServings}
                  </Typography>
                </Box.Flex>
                <Box.Flex justifyContent="space-between">
                  <Typography variant="body-small">
                    From favorite recipes
                  </Typography>
                  <Typography variant="body-small">
                    {statistics?.favorite.avgFavoriteServings}
                  </Typography>
                </Box.Flex>
                <Divider />
                <Typography variant="body-small" fontWeight={600}>
                  Average rating
                </Typography>
                <Box.Flex justifyContent="space-between">
                  <Typography variant="body-small">From all recipes</Typography>
                  <Typography variant="body-small">
                    {statistics?.total.avgTotalRating}
                  </Typography>
                </Box.Flex>
                <Box.Flex justifyContent="space-between">
                  <Typography variant="body-small">
                    From favorite recipes
                  </Typography>
                  <Typography variant="body-small">
                    {statistics?.favorite.avgFavoriteRating}
                  </Typography>
                </Box.Flex>
              </Box.Flex>
            </Section>
          </Box>
          <Box flex={1}>
            <Section title="Cooking time statistics">
              <Box.Flex flexDirection="column" gap="5">
                <Typography variant="body-small" fontWeight={600}>
                  Average preparation time
                </Typography>
                <Box.Flex justifyContent="space-between">
                  <Typography variant="body-small">From all recipes</Typography>
                  <Typography variant="body-small">
                    {formatTimeMinutes(
                      data.statistics.total.avgTotalPrepTimeMinutes
                    )}
                  </Typography>
                </Box.Flex>
                <Box.Flex justifyContent="space-between">
                  <Typography variant="body-small">
                    From favorite recipes
                  </Typography>
                  <Typography variant="body-small">
                    {formatTimeMinutes(
                      data.statistics.favorite.avgFavoritePrepTimeMinutes
                    )}
                  </Typography>
                </Box.Flex>
                <Divider />
                <Typography variant="body-small" fontWeight={600}>
                  Average cooking time
                </Typography>
                <Box.Flex justifyContent="space-between">
                  <Typography variant="body-small" fontWeight={600}>
                    From all recipes
                  </Typography>
                  <Typography variant="body-small">
                    {formatTimeMinutes(
                      data.statistics.total.avgTotalCookTimeMinutes
                    )}
                  </Typography>
                </Box.Flex>
                <Box.Flex justifyContent="space-between">
                  <Typography variant="body-small" fontWeight={600}>
                    From favorite recipes
                  </Typography>
                  <Typography variant="body-small">
                    {formatTimeMinutes(
                      data.statistics.favorite.avgFavoriteCookTimeMinutes
                    )}
                  </Typography>
                </Box.Flex>
                <Divider />
                <Typography variant="body-small" fontWeight={600}>
                  Average total cooking time
                </Typography>
                <Box.Flex justifyContent="space-between">
                  <Typography variant="body-small" fontWeight={600}>
                    From all recipes
                  </Typography>
                  <Typography variant="body-small">
                    {formatTimeMinutes(
                      data.statistics.total.avgTotalTotalTimeMinutes
                    )}
                  </Typography>
                </Box.Flex>
                <Box.Flex justifyContent="space-between">
                  <Typography variant="body-small" fontWeight={600}>
                    From favorite recipes
                  </Typography>
                  <Typography variant="body-small">
                    {formatTimeMinutes(
                      data.statistics.favorite.avgFavoriteTotalTimeMinutes
                    )}
                  </Typography>
                </Box.Flex>
              </Box.Flex>
            </Section>
          </Box>
        </Box.Flex>
      )}
      <PageHeader
        title="All recipes"
        subtitle="A list of recipes retrieved form a Aiven for PostgreSQL® database."
      />
      {isLoading ? (
        <DataTable.Skeleton columns={4} rows={10} />
      ) : (
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
