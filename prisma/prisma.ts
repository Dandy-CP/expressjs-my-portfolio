import { PrismaClient } from "@prisma/client";
import { pagination } from "prisma-extension-pagination";

const prisma = new PrismaClient().$extends(
  pagination({
    pages: {
      limit: 5,
      includePageCount: true,
    },
  })
);

export default prisma;
