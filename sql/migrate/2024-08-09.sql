CREATE TABLE `license`
(
    `id`              INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`            VARCHAR(255),
    `description`     LONGTEXT,
    `date_from`       DATE,
    `date_to`         DATE,
    `project_id`      INT(6) UNSIGNED,
    `client_id`       INT(6) UNSIGNED,
    `end_customer_id` INT(6) UNSIGNED
) CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

ALTER TABLE `license` ADD `amount` DOUBLE(20,5);
ALTER TABLE `license` ADD `before_license_id` INT(6) UNSIGNED;
ALTER TABLE `license` ADD `after_license_id` INT(6) UNSIGNED;
ALTER TABLE `license` ADD `cost_id` INT(6) UNSIGNED;