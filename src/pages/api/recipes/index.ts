import { DEFAULT_PAGE_SIZE } from "@/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { ErrorResponse, RecipesResponse } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RecipesResponse | ErrorResponse>
) {
  if (req.method === "GET") {
    const page = Number(req.query.page) || 1;
    const startTime = process.hrtime();

    const recipes = await prisma.recipe.findMany({
      skip: DEFAULT_PAGE_SIZE * (page - 1),
      take: DEFAULT_PAGE_SIZE,
      // The dataset contains a lot of duplicate names, ratings etc. so this is needed to have the consistency in the results.
      orderBy: [
        { rating: "desc" },
        {
          recipeName: "asc",
        },
        {
          id: "desc",
        },
      ],
    });

    const endTime = process.hrtime(startTime);

    const endToEndRetrievalTimeMs = Number(
      (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(2)
    );

    const totalRecipesCount = await prisma.recipe.count();
    const totalPages = Math.ceil(totalRecipesCount / DEFAULT_PAGE_SIZE);
    const resultsBeforeCurrentPage = DEFAULT_PAGE_SIZE * (page - 1);
    const resultsAfterCurrentPage =
      totalRecipesCount - resultsBeforeCurrentPage - DEFAULT_PAGE_SIZE;
    const hasPreviousPage = resultsBeforeCurrentPage > 0;
    const hasNextPage = resultsAfterCurrentPage > 0;

    res.json({
      recipes,
      page,
      totalPages,
      hasPreviousPage,
      hasNextPage,
      endToEndRetrievalTimeMs,
    });

    return;
  }

  res.status(405).json({ message: "Method not allowed." });
}
