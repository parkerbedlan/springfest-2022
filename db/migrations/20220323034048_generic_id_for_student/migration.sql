/*
  Warnings:

  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[tuid]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_ActivityToStudent" DROP CONSTRAINT "_ActivityToStudent_B_fkey";

-- DropForeignKey
ALTER TABLE "_OrgToStudent" DROP CONSTRAINT "_OrgToStudent_B_fkey";

-- DropForeignKey
ALTER TABLE "_StudentToTeam" DROP CONSTRAINT "_StudentToTeam_A_fkey";

-- AlterTable
ALTER TABLE "Student" DROP CONSTRAINT "Student_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Student_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Student_tuid_key" ON "Student"("tuid");

-- AddForeignKey
ALTER TABLE "_StudentToTeam" ADD FOREIGN KEY ("A") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrgToStudent" ADD FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActivityToStudent" ADD FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
