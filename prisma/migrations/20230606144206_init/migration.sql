-- CreateTable
CREATE TABLE "Recipe" (
    "id" SERIAL NOT NULL,
    "recipe_name" TEXT NOT NULL,
    "prepTime" TEXT NOT NULL,
    "cook_time" TEXT,
    "total_time" TEXT NOT NULL,
    "servings" INTEGER NOT NULL,
    "yield" TEXT,
    "ingredients" JSONB NOT NULL,
    "directions" TEXT[],
    "rating" TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);
