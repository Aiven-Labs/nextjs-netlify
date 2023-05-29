import React, { useEffect, useState } from 'react';
import { Box, DataTable, EmptyState } from '@aivenio/aquarium';
import loading from '@aivenio/aquarium/icons/loading';
import { useRouter } from 'next/router';

import { DEFAULT_PAGE_SIZE } from '@/constants';
import { useAppContext } from '@/context';
import { useRecipes } from '@/hooks';
import { ErrorResponse, RecipesResponse } from '@/types';
import { formatTimeMinutes } from '@/utils';

interface Props {
  isLoading: boolean;
  error?: ErrorResponse;
  data?: RecipesResponse;
  refetchRecipeStats: () => void;
  refetchRecipes: () => void;
  isRefetchingRecipes: boolean;
}

export const RecipesTable: React.FC<Props> = ({
  isLoading,
  error,
  data,
  refetchRecipes,
  refetchRecipeStats,
  isRefetchingRecipes,
}) => {
  const { changingRecipeIdsLiked } = useAppContext();
  const [recipeIdsReloading, setRecipeIdsReloading] = useState<number[]>([]);

  useEffect(() => {
    if (!isRefetchingRecipes) {
      setRecipeIdsReloading([]);
    }
  }, [isRefetchingRecipes, setRecipeIdsReloading]);

  const isRecipeBeingModified = (id: number) =>
    [...changingRecipeIdsLiked, ...recipeIdsReloading].find((rid) => rid === id);

  const { changeRecipeLiked } = useRecipes();
  const router = useRouter();

  const rows =
    data?.recipes.map(({ id, recipeName, rating, totalTimeMinutes, isLiked }) => ({
      id,
      recipeName,
      rating,
      totalTime: formatTimeMinutes(totalTimeMinutes),
      isLiked,
    })) ?? [];

  if (isLoading) {
    return <DataTable.Skeleton columns={5} rows={DEFAULT_PAGE_SIZE} />;
  }

  if (error) {
    return (
      <EmptyState
        title={error.message ?? 'Failed to load recipes.'}
        primaryAction={{
          onClick: refetchRecipes,
          text: 'Refetch recipes',
        }}
      />
    );
  }

  return (
    <Box style={{ overflowX: 'auto' }}>
      <DataTable
        ariaLabel="All recipes"
        columns={[
          {
            field: 'recipeName',
            headerName: 'Recipe name',
            type: 'text',
          },
          {
            field: 'rating',
            headerName: 'Recipe rating',
            type: 'text',
          },
          {
            field: 'totalTime',
            headerName: 'Total cooking time',
            type: 'text',
          },
          {
            headerName: 'Recipe',
            type: 'action',
            action: (row) => ({
              onClick: () => router.push(`/recipes/${row.id}`),
              text: 'See recipe',
            }),
          },
          {
            headerName: 'Like',
            type: 'action',
            action: (row) => ({
              onClick: () =>
                changeRecipeLiked({
                  isLiked: !row.isLiked,
                  id: row.id,
                  onSuccess: async () => {
                    setRecipeIdsReloading((curr) => [...curr, row.id]);
                    refetchRecipes();
                    refetchRecipeStats();
                  },
                }),
              text: row.isLiked ? 'Unlike' : 'Like',
              icon: isRecipeBeingModified(row.id) ? loading : row.isLiked ? 'mdi:heart' : 'mdi:heart-outline',
              disabled: !!isRecipeBeingModified(row.id), // Aquarium does not support a loading state for this component - disable it for now.
            }),
          },
        ]}
        rows={rows}
      />
    </Box>
  );
};
