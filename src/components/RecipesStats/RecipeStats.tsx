import React from 'react';
import { Box, DataTable, Divider, EmptyState, Section, Typography } from '@aivenio/aquarium';

import { RecipeCard } from '@/components/RecipeCard/RecipeCard';
import { ErrorResponse, RecipeStatsResponse } from '@/types';
import { formatTimeMinutes } from '@/utils';

interface Props {
  isLoading: boolean;
  error?: ErrorResponse;
  data?: RecipeStatsResponse;
  refetchRecipeStats: () => void;
}

export const RecipeStats: React.FC<Props> = ({ isLoading, error, data, refetchRecipeStats }) => {
  if (isLoading) {
    return <DataTable.Skeleton columns={4} rows={7} />;
  }

  if (error) {
    return (
      <EmptyState
        title={error.message ?? 'Failed to load recipe stats.'}
        primaryAction={{
          onClick: refetchRecipeStats,
          text: 'Refetch recipe stats',
        }}
      />
    );
  }

  return (
    <Box.Flex justifyContent="space-between" gap="5" className="flex-wrap">
      <RecipeCard>
        <Section title="Recipe statistics">
          <Box.Flex flexDirection="column" gap="5">
            <Typography.SmallStrong>Recipes</Typography.SmallStrong>
            <Box.Flex flexDirection="column" gap="2">
              <Box.Flex justifyContent="space-between">
                <Typography.Small>All recipes</Typography.Small>
                <Typography.Small>{data?.total.totalRecipesCount}</Typography.Small>
              </Box.Flex>
              <Box.Flex justifyContent="space-between">
                <Typography.Small>Liked recipes</Typography.Small>
                <Typography.Small>{data?.liked.likedRecipesCount}</Typography.Small>
              </Box.Flex>
            </Box.Flex>
            <Divider />
            <Typography.SmallStrong>Average amount of servings</Typography.SmallStrong>
            <Box.Flex flexDirection="column" gap="2">
              <Box.Flex justifyContent="space-between">
                <Typography.Small>From all recipes</Typography.Small>
                <Typography.Small>{data?.total.avgTotalServings}</Typography.Small>
              </Box.Flex>
              <Box.Flex justifyContent="space-between">
                <Typography.Small>From liked recipes</Typography.Small>
                <Typography.Small>{data?.liked.avgLikedServings}</Typography.Small>
              </Box.Flex>
            </Box.Flex>
            <Divider />
            <Typography.SmallStrong>Average rating</Typography.SmallStrong>
            <Box.Flex flexDirection="column" gap="2">
              <Box.Flex justifyContent="space-between">
                <Typography.Small>From all recipes</Typography.Small>
                <Typography.Small>{data?.total.avgTotalRating}</Typography.Small>
              </Box.Flex>
              <Box.Flex justifyContent="space-between">
                <Typography.Small>From liked recipes</Typography.Small>
                <Typography.Small>{data?.liked.avgLikedRating}</Typography.Small>
              </Box.Flex>
            </Box.Flex>
          </Box.Flex>
        </Section>
      </RecipeCard>
      <RecipeCard>
        <Section title="Cooking time statistics">
          <Box.Flex flexDirection="column" gap="5">
            <Typography.SmallStrong>Average preparation time</Typography.SmallStrong>
            <Box.Flex flexDirection="column" gap="2">
              <Box.Flex justifyContent="space-between">
                <Typography.Small>From all recipes</Typography.Small>
                <Typography.Small>{formatTimeMinutes(data?.total.avgTotalPrepTimeMinutes)}</Typography.Small>
              </Box.Flex>
              <Box.Flex justifyContent="space-between">
                <Typography.Small>From liked recipes</Typography.Small>
                <Typography.Small>{formatTimeMinutes(data?.liked.avgLikedPrepTimeMinutes)}</Typography.Small>
              </Box.Flex>
            </Box.Flex>
            <Divider />
            <Typography.SmallStrong>Average cooking time</Typography.SmallStrong>
            <Box.Flex flexDirection="column" gap="2">
              <Box.Flex justifyContent="space-between">
                <Typography.Small>From all recipes</Typography.Small>
                <Typography.Small>{formatTimeMinutes(data?.total.avgTotalCookTimeMinutes)}</Typography.Small>
              </Box.Flex>
              <Box.Flex justifyContent="space-between">
                <Typography.Small>From liked recipes</Typography.Small>
                <Typography.Small>{formatTimeMinutes(data?.liked.avgLikedCookTimeMinutes)}</Typography.Small>
              </Box.Flex>
            </Box.Flex>
            <Divider />
            <Typography.SmallStrong>Average total cooking time</Typography.SmallStrong>
            <Box.Flex flexDirection="column" gap="2">
              <Box.Flex justifyContent="space-between">
                <Typography.Small>From all recipes</Typography.Small>
                <Typography.Small>{formatTimeMinutes(data?.total.avgTotalTotalTimeMinutes)}</Typography.Small>
              </Box.Flex>
              <Box.Flex justifyContent="space-between">
                <Typography.Small>From liked recipes</Typography.Small>
                <Typography.Small>{formatTimeMinutes(data?.liked.avgLikedTotalTimeMinutes)}</Typography.Small>
              </Box.Flex>
            </Box.Flex>
          </Box.Flex>
        </Section>
      </RecipeCard>
    </Box.Flex>
  );
};
