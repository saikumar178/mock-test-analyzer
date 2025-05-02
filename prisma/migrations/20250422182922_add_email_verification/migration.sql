-- AlterTable
ALTER TABLE `user` ADD COLUMN `emailToken` VARCHAR(191) NULL,
    ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false;
