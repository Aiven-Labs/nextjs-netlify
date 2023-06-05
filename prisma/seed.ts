import { Prisma, PrismaClient } from "@prisma/client";
import { createReadStream } from "fs";
import { parse } from "csv-parse";
import { join } from "path";
import { cwd } from "process";

const prisma = new PrismaClient();

// Parse sample data from CSV and insert it to the database.
async function main() {
  const rows: Prisma.RecipeCreateManyInput[] = [];

  createReadStream(join(cwd(), "recipes.csv"))
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", async (row) => {
      const [
        _id, // Omit the "id" property, because they are not unique in the dataset.
        recipeName,
        prepTime,
        cookTime,
        totalTime,
        servings,
        _yield, // "yield" is a reserved keyword.
        ingredients,
        directions,
        rating,
      ] = row;

      rows.push({
        recipeName,
        prepTime,
        cookTime,
        totalTime,
        servings: Number(servings),
        yield: _yield,
        ingredients,
        directions,
        rating,
      });
    })
    .on("end", () => {
      console.log("Finished loading recipes!");
    })
    .on("error", (error) => {
      console.log(error.message);
    });

  await prisma.recipe.createMany({
    data: rows,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
