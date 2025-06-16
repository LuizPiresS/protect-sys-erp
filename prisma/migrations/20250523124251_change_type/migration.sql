/*
  Warnings:

  - You are about to alter the column `due_date` on the `profiles` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(3)` to `Unsupported("date")`.

*/
-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "due_date" SET DATA TYPE date;
