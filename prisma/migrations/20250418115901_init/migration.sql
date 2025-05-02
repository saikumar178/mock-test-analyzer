/*
  Warnings:

  - The primary key for the `performanceanalysis` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `performanceanalysis` table. All the data in the column will be lost.
  - The primary key for the `question` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `question_id` on the `question` table. All the data in the column will be lost.
  - The values [Easy,Medium,Hard] on the enum `Question_difficulty` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `testrecord` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `attempt_id` on the `testrecord` table. All the data in the column will be lost.
  - You are about to drop the column `question_id` on the `testrecord` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `testrecord` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `PerformanceAnalysis` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `PerformanceAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `TestRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionId` to the `TestRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `TestRecord` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `performanceanalysis` DROP FOREIGN KEY `PerformanceAnalysis_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `testrecord` DROP FOREIGN KEY `TestRecord_question_id_fkey`;

-- DropForeignKey
ALTER TABLE `testrecord` DROP FOREIGN KEY `TestRecord_user_id_fkey`;

-- DropIndex
DROP INDEX `TestRecord_question_id_fkey` ON `testrecord`;

-- DropIndex
DROP INDEX `TestRecord_user_id_fkey` ON `testrecord`;

-- AlterTable
ALTER TABLE `performanceanalysis` DROP PRIMARY KEY,
    DROP COLUMN `user_id`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `question` DROP PRIMARY KEY,
    DROP COLUMN `question_id`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `difficulty` ENUM('EASY', 'MEDIUM', 'HARD') NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `testrecord` DROP PRIMARY KEY,
    DROP COLUMN `attempt_id`,
    DROP COLUMN `question_id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `questionId` INTEGER NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL,
    MODIFY `selected_option` VARCHAR(191) NULL,
    MODIFY `correct` BOOLEAN NULL,
    MODIFY `time_taken` INTEGER NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `user` DROP COLUMN `createdAt`,
    DROP COLUMN `image`,
    DROP COLUMN `provider`,
    MODIFY `name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `PerformanceAnalysis_userId_key` ON `PerformanceAnalysis`(`userId`);

-- AddForeignKey
ALTER TABLE `TestRecord` ADD CONSTRAINT `TestRecord_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TestRecord` ADD CONSTRAINT `TestRecord_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PerformanceAnalysis` ADD CONSTRAINT `PerformanceAnalysis_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
