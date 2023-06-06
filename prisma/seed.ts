import { Prisma, PrismaClient } from "@prisma/client";
import { createReadStream } from "fs";
import { parse } from "csv-parse";
import { join } from "path";
import { cwd } from "process";

const prisma = new PrismaClient();

// Normalize the string representations of prep time, cook time & total time to a numeric minute format for further aggregation.
// A better way to do this would be to define a trigger in the database but Prisma does unfortunately support those.
const getTimeMinutes = (time: string) => {
  let days = 0;
  let hours = 0;
  let minutes = 0;

  const daysMatch = time.match(/(\d+)\s*days?/);
  const hoursMatch = time.match(/(\d+)\s*hrs?/);
  const minutesMatch = time.match(/(\d+)\s*mins?/);

  if (daysMatch) {
    days = parseInt(daysMatch[1]);
  }

  if (hoursMatch) {
    hours = parseInt(hoursMatch[1]);
  }

  if (minutesMatch) {
    minutes = parseInt(minutesMatch[1]);
  }

  return days * 24 * 60 + hours * 60 + minutes;
};

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
        url,
        _cuisine_path, // Not used.
        nutrition,
      ] = row;

      let cookTimeMinutes;

      if (cookTime) {
        cookTimeMinutes = getTimeMinutes(cookTime);
      }

      rows.push({
        recipeName,
        prepTimeMinutes: getTimeMinutes(prepTime),
        cookTimeMinutes,
        totalTimeMinutes: getTimeMinutes(totalTime),
        servings: Number(servings),
        yield: _yield,
        ingredients,
        directions,
        rating: Number(rating),
        url,
        nutrition,
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
