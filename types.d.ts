import { Prisma, PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
}
