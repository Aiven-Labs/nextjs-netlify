import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = Number(req.query.recipeId);

  if (req.method === "GET") {
    const recipe = await prisma.recipe.findFirst({ where: { id } });

    if (!recipe) {
      res.status(404).json({ message: "Recipe not found." });
    }

    res.json(recipe);
    return;
  }

  if (req.method === "PATCH") {
    const body = JSON.parse(req.body);
    const isFavorite = Boolean(body.isFavorite);

    const recipe = await prisma.recipe.update({
      where: { id },
      data: { isFavorite },
    });

    if (!recipe) {
      res.status(404).json({ message: "Recipe not found." });
    }

    res.json(recipe);
    return;
  }

  res.status(405).json({ message: "Method not allowed." });
}
