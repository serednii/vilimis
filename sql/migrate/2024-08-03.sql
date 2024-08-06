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

DELETE FROM `projectstatus` WHERE 1=1;
DELETE FROM `taskstatus` WHERE 1=1;
INSERT INTO `projectstatus` (`id`, `name`, `color`, `priority`) VALUES
                                                                    (1,	'První kontakt',	NULL,	NULL),
                                                                    (2,	'Čeká na nacenění',	NULL,	1),
                                                                    (3,	'Naceněno',	NULL,	2),
                                                                    (4,	'Čeká se na data od klienta',	NULL,	3),
                                                                    (5,	'Rozpracováno',	'blue',	4),
                                                                    (6,	'Čeká na kontrolu od zákazníka',	NULL,	5),
                                                                    (7,	'K fakturaci',	NULL,	6),
                                                                    (8,	'Vyfakturováno',	NULL,	7),
                                                                    (9,	'Uzavřeno',	NULL,	8),
                                                                    (10,	'Zrušeno',	NULL,	9);

INSERT INTO `taskstatus` (`id`, `name`, `color`, `priority`) VALUES
                                                                 (1,	'Backlog',	'blue',	NULL),
                                                                 (2,	'TODO',	NULL,	2),
                                                                 (3,	'Rozpracováno',	NULL,	4),
                                                                 (4,	'Čekám na podklady',	'red',	1),
                                                                 (5,	'Hotovo',	NULL,	3),
                                                                 (6,	'Zrušeno',	NULL,	5);

