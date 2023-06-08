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
        <Box.Flex justifyContent="space-between" gap="5">
          <Box flex={1}>
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
                <Box.Flex
                  gap="5"
                  style={{
                    whiteSpace: "nowrap", // Not allowed by Aquarium - need to use inline styles.
                  }}
                >
                  <Box.Flex
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    <Typography variant="body-default" fontWeight={600}>
                      Prep time
                    </Typography>
                    <Typography variant="body-default">
                      {formatTimeMinutes(data.prepTimeMinutes)}
                    </Typography>
                  </Box.Flex>
                  <Divider direction="vertical" size={2} />
                  <Box.Flex
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    <Typography variant="body-default" fontWeight={600}>
                      Cook time
                    </Typography>
                    <Typography variant="body-default">
                      {data.cookTimeMinutes &&
                        formatTimeMinutes(data.cookTimeMinutes)}
                    </Typography>
                  </Box.Flex>
                  <Divider direction="vertical" size={2} />
                  <Box.Flex
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    <Typography variant="body-default" fontWeight={600}>
                      Total time
                    </Typography>
                    <Typography variant="body-default">
                      {formatTimeMinutes(data.totalTimeMinutes)}
                    </Typography>
                  </Box.Flex>
                  <Divider direction="vertical" size={2} />
                  <Box.Flex
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    <Typography variant="body-default" fontWeight={600}>
                      Servings
                    </Typography>
                    <Typography variant="body-default">
                      {data.servings}
                    </Typography>
                  </Box.Flex>
                </Box.Flex>
                <Divider />
                <Box>
                  <Typography variant="body-default" fontWeight={600}>
                    Recipe
                  </Typography>
                  <Typography variant="body-default">
                    {data.directions}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body-default" fontWeight={600}>
                    Recipe by:
                  </Typography>
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
          </Box>
          <Box flex={1}>
            <Section title="Ingredients">
              <Box.Flex flexDirection="column" gap="5">
                <Typography variant="body-default">
                  {data.ingredients}
                </Typography>
                <Divider />
                <Typography variant="body-default" fontWeight={600}>
                  Nutrition facts (per serving)
                </Typography>
                {nutritionData && (
                  <Box>
                    {Object.entries(nutritionData).map(
                      ([key, { unit, value }]) => (
                        <Box.Flex key={key} gap="2">
                          <Typography variant="body-default" fontWeight={600}>
                            {key}:
                          </Typography>{" "}
                          <Typography variant="body-default">
                            {value} {unit}
                          </Typography>
                        </Box.Flex>
                      )
                    )}
                  </Box>
                )}
              </Box.Flex>
            </Section>
          </Box>
        </Box.Flex>
      )}
    </Layout>
  );
}
