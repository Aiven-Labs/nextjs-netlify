import React, { useEffect, useState } from 'react';
import { Box, PageHeader, Pagination } from '@aivenio/aquarium';
import useSWR from 'swr';

import { Layout } from '@/components/Layout/Layout';
import { RecipeStats } from '@/components/RecipesStats/RecipeStats';
import { RecipesTable } from '@/components/RecipesTable/RecipesTable';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import fetcher from '@/lib/fetcher';
import { ErrorResponse, RecipesResponse, RecipeStatsResponse } from '@/types';

export default function Recipes() {
  const [page, setPage] = useState(1);

  const {
    data: recipeStatsData,
    isLoading: recipeStatsLoading,
    error: recipeStatsError,
    mutate: mutateRecipeStats,
  } = useSWR<RecipeStatsResponse | undefined, ErrorResponse>('/api/recipes/stats', fetcher, { errorRetryCount: 0 });

  const refetchRecipeStats = () => mutateRecipeStats();

  const {
    data: recipesData,
    isLoading: recipesLoading,
    error: recipesError,
    mutate: mutateRecipes,
  } = useSWR<RecipesResponse | undefined, ErrorResponse>(`/api/recipes?page=${page}`, fetcher, { errorRetryCount: 0 });

  const refetchRecipes = () => mutateRecipes();

  useEffect(() => {
    if (recipesData?.page) {
      setPage(recipesData.page);
    }
  }, [recipesData?.page]);

  return (
    <Layout>
      <Box.Flex flexDirection="column" gap="5">
        <PageHeader
          title="Statistics"
          subtitle={
            recipeStatsData?.endToEndRetrievalTimeMs
              ? `Recipe statistics cached in Aiven for Redis®, retrieved in ${recipeStatsData.endToEndRetrievalTimeMs}ms (end-to-end with round
          trip between your serverless function and your database, results will vary depending on the region of your Aiven
          for Redis® instance).`
              : 'Recipe statistics retrieved from PostgreSQL database. To get cached results using Aiven for Redis®, please follow the instructions to set up your Redis instance.'
          }
        />
        <RecipeStats
          isLoading={recipeStatsLoading}
          error={recipeStatsError}
          data={recipeStatsData}
          refetchRecipeStats={refetchRecipeStats}
        />
      </Box.Flex>
      <Box.Flex flexDirection="column" gap="5" marginTop="6">
        <PageHeader
          title="All recipes"
          subtitle={`A list of recipes retrieved form a Aiven for PostgreSQL® database, retrieved in ${recipesData?.endToEndRetrievalTimeMs}ms (end-to-end with round
          trip between your serverless function and your database, results will vary depending on the region of your Aiven
          for PostgreSQL® instance).`}
        />
        <RecipesTable
          isLoading={recipesLoading}
          error={recipesError}
          data={recipesData}
          refetchRecipeStats={refetchRecipeStats}
          refetchRecipes={refetchRecipes}
        />
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
      </Box.Flex>
    </Layout>
  );
}
