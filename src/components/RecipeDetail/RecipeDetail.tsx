import React from 'react';
import { Box, DataTable, Divider, EmptyState, Link, Section, Typography } from '@aivenio/aquarium';
import { Recipe } from '@prisma/client';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import { RecipeCard } from '@/components/RecipeCard/RecipeCard';
import { useAppContext } from '@/context';
import { useRecipes } from '@/hooks';
import fetcher from '@/lib/fetcher';
import { ErrorResponse } from '@/types';
import { formatTimeMinutes, parseNutritionInfo } from '@/utils';

export const RecipeDetail: React.FC = () => {
  const {
    query: { recipeId },
  } = useRouter();

  const { data, isLoading, error, mutate } = useSWR<Recipe, ErrorResponse>(
    recipeId ? `/api/recipes/${recipeId}` : null,
    fetcher,
    { errorRetryCount: 0 },
  );

  const refetchRecipe = () => {
    mutate();
  };

  const { changingRecipeIdsLiked } = useAppContext();
  const { changeRecipeLiked } = useRecipes();
  const nutritionData = data?.nutrition && parseNutritionInfo(data?.nutrition);

  if (isLoading) {
    return <DataTable.Skeleton columns={4} rows={18} />;
  }

  if (error) {
    return (
      <EmptyState
        title={error.message ?? 'Failed to load recipe.'}
        primaryAction={{
          onClick: refetchRecipe,
          text: 'Refetch recipe',
        }}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        title="Recipe not found."
        primaryAction={{
          onClick: refetchRecipe,
          text: 'Refetch recipe',
        }}
      />
    );
  }

  return (
    <Box.Flex justifyContent="space-between" gap="5" className="flex-wrap">
      <RecipeCard>
        <Section
          title={data.recipeName}
          actions={[
            {
              text: data.isLiked ? 'Unlike' : 'Like',
              icon: data.isLiked ? 'mdi:heart' : 'mdi:heart-outline',
              onClick: () => {
                changeRecipeLiked({
                  isLiked: !data.isLiked,
                  id: data.id,
                  onSuccess: async () => {
                    refetchRecipe();
                  },
                });
              },
              loading: !!changingRecipeIdsLiked.find((id) => id === data.id),
            },
          ]}
        >
          <Box.Flex flexDirection="column" gap="5">
            <Image src={data.imgSrc ?? ''} width={513} height={216} alt="Sample image of a recipe." />
            <Divider />
            <Box>
              <Box.Flex gap="2">
                <Typography.DefaultStrong>Prep time:</Typography.DefaultStrong>{' '}
                <Typography.Default>{formatTimeMinutes(data.prepTimeMinutes)}</Typography.Default>
              </Box.Flex>
              {data?.cookTimeMinutes && (
                <Box.Flex gap="2">
                  <Typography.DefaultStrong>Cook time:</Typography.DefaultStrong>{' '}
                  <Typography.Default>{formatTimeMinutes(data.cookTimeMinutes)}</Typography.Default>
                </Box.Flex>
              )}
              <Box.Flex gap="2">
                <Typography.DefaultStrong>Total time:</Typography.DefaultStrong>{' '}
                <Typography.Default>{formatTimeMinutes(data.totalTimeMinutes)}</Typography.Default>
              </Box.Flex>
              <Box.Flex gap="2">
                <Typography.DefaultStrong>Servings:</Typography.DefaultStrong>{' '}
                <Typography.Default>{data.servings}</Typography.Default>
              </Box.Flex>
            </Box>
            <Divider />
            <Box>
              <Typography.DefaultStrong>Recipe</Typography.DefaultStrong>
              <Typography.Default>{data.directions}</Typography.Default>
            </Box>
            <Box style={{ wordWrap: 'break-word' }}>
              <Typography.DefaultStrong>Recipe by</Typography.DefaultStrong>
              {data.url ? (
                <Link href={data.url} target="_blank">
                  {data.url}
                </Link>
              ) : (
                'N/A'
              )}
            </Box>
          </Box.Flex>
        </Section>
      </RecipeCard>
      <RecipeCard>
        <Section title="Ingredients">
          <Box.Flex flexDirection="column" gap="5">
            <Typography.Default>{data.ingredients?.toString()}</Typography.Default>
            <Divider />
            <Typography.DefaultStrong>Nutrition facts (per serving)</Typography.DefaultStrong>
            {nutritionData && (
              <Box>
                {Object.entries(nutritionData).map(([key, { unit, value }]) => (
                  <Box.Flex key={key} gap="2">
                    <Typography.DefaultStrong>{key}:</Typography.DefaultStrong>{' '}
                    <Typography.Default>
                      {value} {unit}
                    </Typography.Default>
                  </Box.Flex>
                ))}
              </Box>
            )}
          </Box.Flex>
        </Section>
      </RecipeCard>
    </Box.Flex>
  );
};
