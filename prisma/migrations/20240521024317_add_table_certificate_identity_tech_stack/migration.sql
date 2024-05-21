-- CreateTable
CREATE TABLE "certificate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity" (
    "id" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "cv_file" TEXT NOT NULL,
    "image_profile" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "identity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tech_stack" (
    "id" TEXT NOT NULL,
    "nameTech" TEXT NOT NULL,
    "imageTech" TEXT NOT NULL,
    "identityID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tech_stack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "certificate_id_key" ON "certificate"("id");

-- CreateIndex
CREATE UNIQUE INDEX "identity_id_key" ON "identity"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tech_stack_id_key" ON "tech_stack"("id");

-- AddForeignKey
ALTER TABLE "tech_stack" ADD CONSTRAINT "tech_stack_identityID_fkey" FOREIGN KEY ("identityID") REFERENCES "identity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
