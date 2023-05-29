import { createReadStream } from 'fs';
import { join } from 'path';
import { cwd } from 'process';

import { Prisma, PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse';

const prisma = new PrismaClient();

/*
 * Normalize the string representations of prep time, cook time & total time to a numeric minute format for further aggregation.
 * A better way to do this would be to define a trigger in the database but Prisma does unfortunately support those.
 */
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
  const currentRecipeCount = await prisma.recipe.count();
  if (currentRecipeCount !== 0) {
    return; // We only want to seed if the database has not been seeded
  }

  const readRowsFromFile = new Promise<Prisma.RecipeCreateManyInput[]>((resolve) => {
    const rows: Prisma.RecipeCreateManyInput[] = [];

    createReadStream(join(cwd(), 'recipes.csv'))
      .pipe(parse({ delimiter: ',', from_line: 2 }))
      .on('data', (row) => {
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
          _timing, // Not used
          imgSrc,
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
          imgSrc,
          nutrition,
        });
      })
      .on('end', () => {
        // eslint-disable-next-line no-console
        console.log('Finished loading recipes!');
        resolve(rows);
      })
      .on('error', (error) => {
        // eslint-disable-next-line no-console
        console.log(error.message);
        resolve([]);
      });
  });

  const rows = await readRowsFromFile;

  await prisma.recipe.createMany({
    data: rows,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
