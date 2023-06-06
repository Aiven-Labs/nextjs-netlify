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
      recipes: Recipe[];
      totalRecipesCount: number;
      favoriteRecipesCount: number;
      avgTotalServings: number;
      avgFavoriteServings: number;
      avgTotalRating: number;
      avgFavoriteRating: number;
      avgTotalPrepTimeMinutes: number;
      avgFavoritePrepTimeMinutes: number;
      avgTotalCookTimeMinutes: number;
      avgFavoriteCookTimeMinutes: number;
      avgTotalTotalTimeMinutes: number;
      avgFavoriteTotalTimeMinutes: number;
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

  useEffect(() => {
    if (data?.page) {
      setPage(data.page);
    }
  }, [data?.page]);

  if (error) {
    return <EmptyState title="Failed to load recipes." />;
  }

  return (
    <Layout>
      <PageHeader
        title="Statistics"
        subtitle="A list of recipes retrieved form a Aiven for PostgreSQL® database."
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
                    {data.totalRecipesCount}
                  </Typography>
                </Box.Flex>
                <Box.Flex justifyContent="space-between">
                  <Typography variant="body-small">Favorite recipes</Typography>
                  <Typography variant="body-small">
                    {data.favoriteRecipesCount}
                  </Typography>
                </Box.Flex>
                <Divider />
                <Typography variant="body-small" fontWeight={600}>
                  Average amount of servings
                </Typography>
                <Box.Flex justifyContent="space-between">
                  <Typography variant="body-small">From all recipes</Typography>
                  <Typography variant="body-small">
                    {data.avgTotalServings}
                  </Typography>
                </Box.Flex>
                <Box.Flex justifyContent="space-between">
                  <Typography variant="body-small">
                    From favorite recipes
                  </Typography>
                  <Typography variant="body-small">
                    {data.avgFavoriteServings}
                  </Typography>
                </Box.Flex>
                <Divider />
                <Typography variant="body-small" fontWeight={600}>
                  Average rating
                </Typography>
                <Box.Flex justifyContent="space-between">
                  <Typography variant="body-small">From all recipes</Typography>
                  <Typography variant="body-small">
                    {data.avgTotalRating}
                  </Typography>
                </Box.Flex>
                <Box.Flex justifyContent="space-between">
                  <Typography variant="body-small">
                    From favorite recipes
                  </Typography>
                  <Typography variant="body-small">
                    {data.avgFavoriteRating}
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
                    {formatTimeMinutes(data.avgTotalPrepTimeMinutes)}
                  </Typography>
                </Box.Flex>
                <Box.Flex justifyContent="space-between">
                  <Typography variant="body-small">
                    From favorite recipes
                  </Typography>
                  <Typography variant="body-small">
                    {formatTimeMinutes(data.avgFavoritePrepTimeMinutes)}
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
                    {formatTimeMinutes(data.avgTotalCookTimeMinutes)}
                  </Typography>
                </Box.Flex>
                <Box.Flex justifyContent="space-between">
                  <Typography variant="body-small" fontWeight={600}>
                    From favorite recipes
                  </Typography>
                  <Typography variant="body-small">
                    {formatTimeMinutes(data.avgFavoriteCookTimeMinutes)}
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
                    {formatTimeMinutes(data.avgTotalTotalTimeMinutes)}
                  </Typography>
                </Box.Flex>
                <Box.Flex justifyContent="space-between">
                  <Typography variant="body-small" fontWeight={600}>
                    From favorite recipes
                  </Typography>
                  <Typography variant="body-small">
                    {formatTimeMinutes(data.avgFavoriteTotalTimeMinutes)}
                  </Typography>
                </Box.Flex>
              </Box.Flex>
            </Section>
          </Box>
        </Box.Flex>
      )}
      <PageHeader title="All recipes" />
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
                    callback: refetchRecipes,
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
