-- AlterTable
ALTER TABLE "admin_user" ADD COLUMN     "is_2fa" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "totp_secret" TEXT;
