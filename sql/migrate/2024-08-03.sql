CREATE TABLE `checklist` (
                             `id` INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                             `name` VARCHAR(255),
                             `description` LONGTEXT
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE `checklistgroup` (
                                  `id` INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                                  `name` VARCHAR(255),
                                  `description` LONGTEXT,
                                  `priority` INT(9),
                                  `done` TINYINT(1)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

CREATE TABLE `checklistitem` (
                                 `id` INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                                 `name` VARCHAR(255),
                                 `description` LONGTEXT,
                                 `priority` INT(9),
                                 `done` TINYINT(1)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

ALTER TABLE `checklistgroup` ADD `checklist_id` INT(6) UNSIGNED;
ALTER TABLE `checklistitem` ADD `checklist_group_id` INT(6) UNSIGNED;



ALTER TABLE `checklistitem` ADD `checklist_id` INT(6) UNSIGNED;
ALTER TABLE `checklist` ADD `project_id` INT(6) UNSIGNED;
ALTER TABLE `checklist` ADD `task_id` INT(6) UNSIGNED;

