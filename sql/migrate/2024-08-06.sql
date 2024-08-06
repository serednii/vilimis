CREATE TABLE `costcategory`
(
    `id`    INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`  VARCHAR(255),
    `color` VARCHAR(255)
) CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

CREATE TABLE `costrepeatable`
(
    `id`                      INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`                    VARCHAR(255),
    `description`             LONGTEXT,
    `cost_category_id`        INT(6) UNSIGNED,
    `frequency`               VARCHAR(255),
    `amount`                  DOUBLE(20, 5),
    `day_of_accounting`       INT(9),
    `first_day_of_accounting` DATE
) CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

CREATE TABLE `cost`
(
    `id`                 INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`               VARCHAR(255),
    `description`        LONGTEXT,
    `cost_category_id`   INT(6) UNSIGNED,
    `amount`             DOUBLE(20, 5),
    `day_of_accounting`  DATE,
    `cost_repeatable_id` INT(6) UNSIGNED
) CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;