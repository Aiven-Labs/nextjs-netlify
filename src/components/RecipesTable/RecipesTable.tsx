import React from 'react';
import { Box, DataTable, EmptyState, Link } from '@aivenio/aquarium';
import heart from '@aivenio/aquarium/icons/heart';
import loading from '@aivenio/aquarium/icons/loading';
import trash from '@aivenio/aquarium/icons/trash';

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
}

export const RecipesTable: React.FC<Props> = ({ isLoading, error, data, refetchRecipes, refetchRecipeStats }) => {
  const { addingRecipeIdToFavorites } = useAppContext();
  const { addRecipeToFavorites } = useRecipes();

  const rows =
    data?.recipes.map(({ id, recipeName, rating, totalTimeMinutes, isFavorite }) => ({
      id,
      recipeName,
      rating,
      totalTime: formatTimeMinutes(totalTimeMinutes),
      isFavorite,
    })) ?? [];

  if (isLoading) {
    return <DataTable.Skeleton columns={4} rows={10} />;
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
            type: 'custom',
            UNSAFE_render: (row) => <Link href={`/recipes/${row.id}`}>{row.recipeName}</Link>,
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
            headerName: 'Favorite',
            type: 'action',
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
              text: row.isFavorite ? 'Remove favorite' : 'Add to favorites',
              icon: addingRecipeIdToFavorites === row.id ? loading : row.isFavorite ? trash : heart,
              disabled: addingRecipeIdToFavorites === row.id, // Aquarium does not support a loading state for this component - disable it for now.
            }),
          },
        ]}
        rows={rows}
      />
    </Box>
  );
};
