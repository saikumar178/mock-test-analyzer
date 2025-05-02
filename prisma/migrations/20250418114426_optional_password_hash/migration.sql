/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `user` table. All the data in the column will be lost.
  - Added the required column `id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `performanceanalysis` DROP FOREIGN KEY `PerformanceAnalysis_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `testrecord` DROP FOREIGN KEY `TestRecord_user_id_fkey`;

-- DropIndex
DROP INDEX `TestRecord_user_id_fkey` ON `testrecord`;

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `user_id`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `image` VARCHAR(191) NULL,
    MODIFY `name` VARCHAR(191) NULL,
    MODIFY `provider` VARCHAR(191) NULL DEFAULT 'credentials',
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `TestRecord` ADD CONSTRAINT `TestRecord_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PerformanceAnalysis` ADD CONSTRAINT `PerformanceAnalysis_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
