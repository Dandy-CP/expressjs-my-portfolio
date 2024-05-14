-- AlterTable
ALTER TABLE "blog" ADD COLUMN     "blogViews" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "blogComment" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "blogId" UUID NOT NULL,

    CONSTRAINT "blogComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blogComment_blogId_key" ON "blogComment"("blogId");

-- AddForeignKey
ALTER TABLE "blogComment" ADD CONSTRAINT "blogComment_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
