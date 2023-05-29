-- CreateTable
CREATE TABLE "recipes" (
    "id" SERIAL NOT NULL,
    "recipe_name" TEXT NOT NULL,
    "prep_time_minutes" INTEGER NOT NULL,
    "cook_time_minutes" INTEGER,
    "total_time_minutes" INTEGER NOT NULL,
    "servings" INTEGER NOT NULL,
    "yield" TEXT,
    "ingredients" JSONB NOT NULL,
    "directions" TEXT[],
    "rating" DOUBLE PRECISION NOT NULL,
    "url" TEXT,
    "imgSrc" TEXT,
    "nutrition" TEXT,
    "is_liked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);
