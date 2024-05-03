-- CreateTable
CREATE TABLE "my_projects" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tech_stack" TEXT[],
    "github" TEXT NOT NULL,
    "demo" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,

    CONSTRAINT "my_projects_pkey" PRIMARY KEY ("id")
);
