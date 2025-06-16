/*
  Warnings:

  - You are about to drop the column `cpf_cnpj` on the `profiles` table. All the data in the column will be lost.
  - Added the required column `identification_document` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "cpf_cnpj",
ADD COLUMN     "identification_document" TEXT NOT NULL;
