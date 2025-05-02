-- AlterTable
ALTER TABLE `user` MODIFY `password_hash` VARCHAR(191) NULL,
    MODIFY `provider` VARCHAR(191) NULL;
