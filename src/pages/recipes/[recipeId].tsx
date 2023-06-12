import { Layout } from "@/components/Layout/Layout";
import { ErrorResponse } from "@/types";
import fetcher from "@/lib/fetcher";
import {
  Box,
  Button,
  Divider,
  Link,
  Section,
  Typography,
} from "@aivenio/aquarium";
import { Recipe } from "@prisma/client";
import useSWR from "swr";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import heart from "@aivenio/aquarium/icons/heart";
import trash from "@aivenio/aquarium/icons/trash";
import { useRouter } from "next/router";
import arrowLeft from "@aivenio/aquarium/icons/arrowLeft";
import { useAppContext } from "@/context";
import { useRecipes } from "@/hooks";
import Image from "next/image";
import { formatTimeMinutes, parseNutritionInfo } from "@/utils";
import { RecipeCard } from "@/components/RecipeCard/RecipeCard";

export default function RecipeDetail() {
  const {
    query: { recipeId },
  } = useRouter();

  const { addingRecipeIdToFavorites } = useAppContext();
  const { addRecipeToFavorites } = useRecipes();

  const {
    data,
    error,
    mutate: refetchRecipe,
  } = useSWR<Recipe, ErrorResponse>(
    recipeId ? `/api/recipes/${recipeId}` : null,
    fetcher
  );

  const nutritionData = data?.nutrition && parseNutritionInfo(data?.nutrition);

  if (error) {
    return <EmptyState title={error.message ?? "Failed to load recipe."} />;
  }

  return (
    <Layout>
      <Box.Flex>
        <Button.Ghost icon={arrowLeft}>
          <Link href="/recipes">Back to all recipes</Link>
        </Button.Ghost>
      </Box.Flex>
      {data && (
        <Box.Flex justifyContent="space-between" gap="5" className="flex-wrap">
          <RecipeCard>
            <Section
              title={data.recipeName}
              actions={[
                {
                  text: data.isFavorite
                    ? "Remove from favorites"
                    : "Add to favorites",
                  icon: data.isFavorite ? trash : heart,
                  onClick: () =>
                    addRecipeToFavorites({
                      isFavorite: !data.isFavorite,
                      id: data.id,
                      onSuccess: refetchRecipe,
                    }),
                  loading: addingRecipeIdToFavorites === data.id,
                },
              ]}
            >
              <Box.Flex flexDirection="column" gap="5">
                <Image
                  src="/recipe.svg"
                  width={513}
                  height={216}
                  alt="Sample image of a recipe."
                />
                <Divider />
                <Box>
                  <Box.Flex gap="2">
                    <Typography.DefaultStrong>
                      Prep time:
                    </Typography.DefaultStrong>{" "}
                    <Typography.Default>
                      {formatTimeMinutes(data.prepTimeMinutes)}
                    </Typography.Default>
                  </Box.Flex>
                  {data.cookTimeMinutes && (
                    <Box.Flex gap="2">
                      <Typography.DefaultStrong>
                        Cook time:
                      </Typography.DefaultStrong>{" "}
                      <Typography.Default>
                        {formatTimeMinutes(data.cookTimeMinutes)}
                      </Typography.Default>
                    </Box.Flex>
                  )}
                  <Box.Flex gap="2">
                    <Typography.DefaultStrong>
                      Total time:
                    </Typography.DefaultStrong>{" "}
                    <Typography.Default>
                      {formatTimeMinutes(data.totalTimeMinutes)}
                    </Typography.Default>
                  </Box.Flex>
                  <Box.Flex gap="2">
                    <Typography.DefaultStrong>
                      Servings:
                    </Typography.DefaultStrong>{" "}
                    <Typography.Default>{data.servings}</Typography.Default>
                  </Box.Flex>
                </Box>
                <Divider />
                <Box>
                  <Typography.DefaultStrong>Recipe</Typography.DefaultStrong>
                  <Typography.Default>{data.directions}</Typography.Default>
                </Box>
                <Box style={{ wordWrap: "break-word" }}>
                  <Typography.DefaultStrong>Recipe by</Typography.DefaultStrong>
                  {data.url ? (
                    <Link href={data.url} target="_blank">
                      {data.url}
                    </Link>
                  ) : (
                    "N/A"
                  )}
                </Box>
              </Box.Flex>
            </Section>
          </RecipeCard>
          <RecipeCard>
            <Section title="Ingredients">
              <Box.Flex flexDirection="column" gap="5">
                <Typography.Default>{data.ingredients}</Typography.Default>
                <Divider />
                <Typography.DefaultStrong>
                  Nutrition facts (per serving)
                </Typography.DefaultStrong>
                {nutritionData && (
                  <Box>
                    {Object.entries(nutritionData).map(
                      ([key, { unit, value }]) => (
                        <Box.Flex key={key} gap="2">
                          <Typography.DefaultStrong>
                            {key}:
                          </Typography.DefaultStrong>{" "}
                          <Typography.Default>
                            {value} {unit}
                          </Typography.Default>
                        </Box.Flex>
                      )
                    )}
                  </Box>
                )}
              </Box.Flex>
            </Section>
          </RecipeCard>
        </Box.Flex>
      )}
    </Layout>
  );
}