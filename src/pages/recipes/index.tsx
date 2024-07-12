import React, { useEffect, useState } from 'react';
import { Box, PageHeader, Pagination, Switch } from '@aivenio/aquarium';
import useSWR from 'swr';

import { RecipeStats } from '@/components/RecipesStats/RecipeStats';
import { RecipesTable } from '@/components/RecipesTable/RecipesTable';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import fetcher from '@/lib/fetcher';
import { ErrorResponse, RecipesResponse, RecipeStatsResponse } from '@/types';

const endToEndInfo =
  'Time is end-to-end with round trip between your serverless function and your database, results will vary depending on the region of your instances';

export default function Recipes() {
  const [page, setPage] = useState(1);
  const [useRedis, setUseRedis] = useState(true);
  const [onlyLiked, setOnlyLiked] = useState(false);

  const {
    data: recipeStatsData,
    isLoading: recipeStatsLoading,
    error: recipeStatsError,
    mutate: mutateRecipeStats,
  } = useSWR<RecipeStatsResponse | undefined, ErrorResponse>(`/api/recipes/stats?useRedis=${useRedis}`, fetcher, {
    errorRetryCount: 0,
  });

  const {
    data: recipesData,
    isLoading: recipesLoading,
    error: recipesError,
    mutate: mutateRecipes,
    isValidating: isRefetchingRecipes,
  } = useSWR<RecipesResponse | undefined, ErrorResponse>(`/api/recipes?page=${page}&onlyLiked=${onlyLiked}`, fetcher, {
    errorRetryCount: 0,
  });

  const refetchRecipeStats = () => {
    mutateRecipeStats();
  };
  const refetchRecipes = () => {
    mutateRecipes();
  };

  useEffect(() => {
    if (recipesData?.page) {
      setPage(recipesData.page);
    }
  }, [recipesData?.page]);

  return (
    <>
      <Box.Flex flexDirection="column" gap="5">
        <PageHeader
          title="Statistics"
          subtitle={
            <Box.Flex flexDirection="column" gap="5">
              <Box>{getStatisticsInfo(recipeStatsData, useRedis)}</Box>
              {recipeStatsData?.isRedisAvailable && (
                <Box minWidth="fit">
                  <Switch
                    caption="Get statistics faster with Aiven for Caching"
                    onChange={() => setUseRedis(!useRedis)}
                    checked={useRedis}
                  >
                    Enable Aiven for Caching
                  </Switch>
                </Box>
              )}
            </Box.Flex>
          }
        ></PageHeader>
        <RecipeStats
          isLoading={recipeStatsLoading}
          error={recipeStatsError}
          data={recipeStatsData}
          refetchRecipeStats={refetchRecipeStats}
        />
      </Box.Flex>
      <Box.Flex flexDirection="column" gap="5" marginTop="6" style={{ minHeight: '65rem' }}>
        <PageHeader
          title="All recipes"
          subtitle={
            <Box.Flex flexDirection="column" gap="5">
              <Box>{`A list of recipes retrieved from an Aiven for PostgreSQL® database, retrieved in ${
                recipesData?.endToEndRetrievalTimeMs ?? '??'
              }ms. ${endToEndInfo}.`}</Box>
              <Box minWidth="fit">
                <Switch onChange={() => setOnlyLiked(!onlyLiked)} checked={onlyLiked}>
                  Show only liked
                </Switch>
              </Box>
            </Box.Flex>
          }
        />
        <RecipesTable
          isLoading={recipesLoading}
          error={recipesError}
          data={recipesData}
          refetchRecipeStats={refetchRecipeStats}
          refetchRecipes={refetchRecipes}
          isRefetchingRecipes={isRefetchingRecipes}
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
    </>
  );
}

const getStatisticsInfo = (stats: RecipeStatsResponse | undefined, useRedis: boolean) => {
  const endToEndRetrievalTime = `${stats?.endToEndRetrievalTimeMs ?? '??'}ms. ${endToEndInfo}`;

  if (!stats?.isRedisAvailable) {
    return `Recipe statistics retrieved from Aiven for PostgreSQL® database in ${endToEndRetrievalTime}. To get cached results using Aiven for Caching, please follow the instructions to set up your Aiven for Caching instance.`;
  }

  if (useRedis) {
    if (stats.fromCache) {
      return `Recipe statistics cached in Aiven for Caching, retrieved in ${endToEndRetrievalTime}.`;
    }

    return `Recipe statistics retrieved from Aiven for PostgreSQL® database in ${endToEndRetrievalTime}. Results are now cached to Aiven for Caching.`;
  }

  return `Recipe statistics retrieved from Aiven for PostgreSQL® database in ${endToEndRetrievalTime}. To get cached results using Aiven for Caching, please enable it.`;
};
