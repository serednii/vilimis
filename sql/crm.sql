-- Adminer 4.8.1 MySQL 10.4.10-MariaDB dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `client`;
CREATE TABLE `client` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `ic` varchar(255) DEFAULT NULL,
  `dic` varchar(255) DEFAULT NULL,
  `hour_rate` int(9) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `web` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `client` (`id`, `name`, `address`, `ic`, `dic`, `hour_rate`, `email`, `phone`, `web`, `logo`) VALUES
(1,	'Bartvisions s.r.o.',	'Nerudova 472\r\n56501 Choceň',	'07522282',	'CZ07522282',	400,	'michaela@bartvisions.cz',	'+420 736 512 566',	'https://www.bartvisions.cz/',	'9f/09/9f091658cd58cdd3364245c9a451a2d1..svg');

DROP TABLE IF EXISTS `endcustomer`;
CREATE TABLE `endcustomer` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `web` varchar(255) DEFAULT NULL,
  `klient_id` int(6) unsigned DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `ic` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `client_id` int(6) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `endcustomer` (`id`, `name`, `web`, `klient_id`, `logo`, `ic`, `address`, `client_id`) VALUES
(1,	'SERVIS CLIMAX a.s.,',	'https://www.climax.cz',	0,	'8e/89/8e897817b716c2ebb94c5bf47cd8dfdb..png',	'25352628',	'Jasenice 1253\r\n755 01 Vsetín',	1);

DROP TABLE IF EXISTS `endcustomercontact`;
CREATE TABLE `endcustomercontact` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `surname` varchar(255) DEFAULT NULL,
  `position` varchar(255) DEFAULT NULL,
  `end_customer_id` int(6) unsigned DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `endcustomercontact` (`id`, `name`, `surname`, `position`, `end_customer_id`, `phone`, `email`, `photo`) VALUES
(1,	'Barbora',	'Abdulová',	'Vedoucí divize - Marketing',	1,	'+420 605 235 200',	'b.abdulova@climax.cz',	'62/4f/624f3e3d25550faa748f281232633cdd..png');

DROP TABLE IF EXISTS `generator_item`;
CREATE TABLE `generator_item` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `module_id` int(11) DEFAULT NULL,
  `sort` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `generator_item` (`id`, `slug`, `type`, `module_id`, `sort`) VALUES
(20,	'password',	'text',	1,	0),
(19,	'surname',	'text',	1,	0),
(18,	'name',	'text',	1,	0),
(17,	'email',	'text',	1,	0),
(90,	'name',	'text',	4,	0),
(91,	'address',	'textarea',	4,	0),
(92,	'ic',	'text',	4,	0),
(93,	'dic',	'text',	4,	0),
(94,	'hour_rate',	'int',	4,	0),
(95,	'email',	'text',	4,	0),
(96,	'phone',	'text',	4,	0),
(97,	'web',	'text',	4,	0),
(124,	'client_id',	'Client',	5,	0),
(123,	'web',	'text',	5,	0),
(105,	'position',	'text',	6,	0),
(106,	'end_customer_id',	'EndCustomer',	6,	0),
(107,	'phone',	'text',	6,	0),
(108,	'email',	'text',	6,	0),
(125,	'logo',	'image',	5,	0),
(104,	'surname',	'text',	6,	0),
(103,	'name',	'text',	6,	0),
(98,	'logo',	'image',	4,	0),
(109,	'photo',	'image',	6,	0),
(126,	'ic',	'text',	5,	0),
(122,	'name',	'text',	5,	0),
(127,	'address',	'textarea',	5,	0),
(145,	'client_id',	'Client',	7,	0),
(146,	'end_customer_id',	'EndCustomer',	7,	0),
(147,	'hour_rate',	'int',	7,	0),
(144,	'budget',	'int',	7,	0),
(143,	'name',	'text',	7,	0),
(152,	'priority',	'int',	8,	0),
(151,	'color',	'text',	8,	0),
(150,	'name',	'text',	8,	0),
(148,	'hour_budget',	'int',	7,	0),
(149,	'project_status_id',	'ProjectStatus',	7,	0),
(157,	'name',	'text',	9,	0),
(158,	'hour_budget',	'int',	9,	0),
(159,	'project_id',	'Project',	9,	0),
(165,	'priority',	'int',	10,	0),
(164,	'color',	'text',	10,	0),
(163,	'name',	'text',	10,	0),
(181,	'priority',	'int',	11,	0),
(182,	'done',	'bool',	11,	0),
(183,	'project_id',	'Project',	11,	0),
(180,	'color',	'text',	11,	0),
(179,	'date',	'date',	11,	0),
(178,	'name',	'text',	11,	0),
(184,	'task_id',	'Task',	11,	0);

DROP TABLE IF EXISTS `generator_item_translation`;
CREATE TABLE `generator_item_translation` (
  `generator_item_id` int(6) unsigned DEFAULT NULL,
  `language` varchar(5) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  UNIQUE KEY `generator_item_id_language` (`generator_item_id`,`language`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `generator_item_translation` (`generator_item_id`, `language`, `name`) VALUES
(1,	'cs',	'E-mail'),
(2,	'cs',	'E-mail'),
(3,	'cs',	'a'),
(4,	'cs',	'b'),
(5,	'cs',	'test_nazev'),
(6,	'cs',	'Testovací'),
(7,	'cs',	'as'),
(8,	'cs',	'E-mail'),
(9,	'cs',	'E-mail'),
(10,	'cs',	'Jméno'),
(11,	'cs',	'Příjmení'),
(12,	'cs',	'Heslo'),
(13,	'cs',	'E-mail'),
(14,	'cs',	'Jméno'),
(15,	'cs',	'Příjmení'),
(16,	'cs',	'Heslo'),
(17,	'cs',	'E-mail'),
(18,	'cs',	'Jméno'),
(19,	'cs',	'Příjmení'),
(20,	'cs',	'Heslo'),
(21,	'cs',	'Název'),
(22,	'cs',	'Adresa'),
(23,	'cs',	'IČ'),
(24,	'cs',	'DIČ'),
(25,	'cs',	'Hodinová sazba'),
(26,	'cs',	''),
(27,	'cs',	''),
(28,	'cs',	''),
(29,	'cs',	'Název'),
(30,	'cs',	'Adresa'),
(31,	'cs',	'IČ'),
(32,	'cs',	'DIČ'),
(33,	'cs',	'Hodinová sazba'),
(34,	'cs',	''),
(35,	'cs',	''),
(36,	'cs',	''),
(37,	'cs',	'Název'),
(38,	'cs',	'Adresa'),
(39,	'cs',	'IČ'),
(40,	'cs',	'DIČ'),
(41,	'cs',	'Hodinová sazba'),
(42,	'cs',	'Email'),
(43,	'cs',	'Telefon'),
(44,	'cs',	'Web'),
(45,	'cs',	'Název'),
(46,	'cs',	'Adresa'),
(47,	'cs',	'IČ'),
(48,	'cs',	'DIČ'),
(49,	'cs',	'Hodinová sazba'),
(50,	'cs',	'Email'),
(51,	'cs',	'Telefon'),
(52,	'cs',	'Web'),
(53,	'cs',	''),
(54,	'cs',	'Název'),
(55,	'cs',	'Adresa'),
(56,	'cs',	'IČ'),
(57,	'cs',	'DIČ'),
(58,	'cs',	'Hodinová sazba'),
(59,	'cs',	'Email'),
(60,	'cs',	'Telefon'),
(61,	'cs',	'Web'),
(62,	'cs',	'Název'),
(63,	'cs',	'Adresa'),
(64,	'cs',	'IČ'),
(65,	'cs',	'DIČ'),
(66,	'cs',	'Hodinová sazba'),
(67,	'cs',	'Email'),
(68,	'cs',	'Telefon'),
(69,	'cs',	'Web'),
(70,	'cs',	'Název'),
(71,	'cs',	'Web'),
(72,	'cs',	'Název'),
(73,	'cs',	'Web'),
(74,	'cs',	'Klient'),
(75,	'cs',	'Jméno'),
(76,	'cs',	'Přijmení'),
(77,	'cs',	'Pozice'),
(78,	'cs',	'Koncový zákazník'),
(79,	'cs',	'Telefon'),
(80,	'cs',	'Email'),
(81,	'cs',	'Název'),
(82,	'cs',	'Web'),
(83,	'cs',	'Klient'),
(84,	'cs',	'Jméno'),
(85,	'cs',	'Přijmení'),
(86,	'cs',	'Pozice'),
(87,	'cs',	'Koncový zákazník'),
(88,	'cs',	'Telefon'),
(89,	'cs',	'Email'),
(90,	'cs',	'Název'),
(91,	'cs',	'Adresa'),
(92,	'cs',	'IČ'),
(93,	'cs',	'DIČ'),
(94,	'cs',	'Hodinová sazba'),
(95,	'cs',	'Email'),
(96,	'cs',	'Telefon'),
(97,	'cs',	'Web'),
(98,	'cs',	'Logo'),
(99,	'cs',	'Název'),
(100,	'cs',	'Web'),
(101,	'cs',	'Klient'),
(102,	'cs',	'Logo'),
(103,	'cs',	'Jméno'),
(104,	'cs',	'Přijmení'),
(105,	'cs',	'Pozice'),
(106,	'cs',	'Koncový zákazník'),
(107,	'cs',	'Telefon'),
(108,	'cs',	'Email'),
(109,	'cs',	'Foto'),
(110,	'cs',	'Název'),
(111,	'cs',	'Web'),
(112,	'cs',	'Klient'),
(113,	'cs',	'Logo'),
(114,	'cs',	'IČ'),
(115,	'cs',	'Adresa'),
(116,	'cs',	'Název'),
(117,	'cs',	'Web'),
(118,	'cs',	'Klient'),
(119,	'cs',	'Logo'),
(120,	'cs',	'IČ'),
(121,	'cs',	'Adresa'),
(122,	'cs',	'Název'),
(123,	'cs',	'Web'),
(124,	'cs',	'Klient'),
(125,	'cs',	'Logo'),
(126,	'cs',	'IČ'),
(127,	'cs',	'Adresa'),
(128,	'cs',	'Název'),
(129,	'cs',	'Rozpočet'),
(130,	'cs',	'Klient'),
(131,	'cs',	'Koncový zákazník'),
(132,	'cs',	'Hodinová sazba'),
(133,	'cs',	'Hodinový rozpočet'),
(134,	'cs',	'Název'),
(135,	'cs',	'Rozpočet'),
(136,	'cs',	'Klient'),
(137,	'cs',	'Koncový zákazník'),
(138,	'cs',	'Hodinová sazba'),
(139,	'cs',	'Hodinový rozpočet'),
(140,	'cs',	'Název'),
(141,	'cs',	'Barva'),
(142,	'cs',	'Priorita'),
(143,	'cs',	'Název'),
(144,	'cs',	'Rozpočet'),
(145,	'cs',	'Klient'),
(146,	'cs',	'Koncový zákazník'),
(147,	'cs',	'Hodinová sazba'),
(148,	'cs',	'Hodinový rozpočet'),
(149,	'cs',	'Stav projektu'),
(150,	'cs',	'Název'),
(151,	'cs',	'Barva'),
(152,	'cs',	'Priorita'),
(153,	'cs',	'Název'),
(154,	'cs',	'Hodinový rozpočet'),
(155,	'cs',	'Název'),
(156,	'cs',	'Hodinový rozpočet'),
(157,	'cs',	'Název'),
(158,	'cs',	'Hodinový rozpočet'),
(159,	'cs',	'Projekt'),
(160,	'cs',	'Název'),
(161,	'cs',	'Barva'),
(162,	'cs',	'Priorita'),
(163,	'cs',	'Název'),
(164,	'cs',	'Barva'),
(165,	'cs',	'Priorita'),
(166,	'cs',	'Název'),
(167,	'cs',	'Datum'),
(168,	'cs',	'Barva'),
(169,	'cs',	'Priorita'),
(170,	'cs',	'Splněno'),
(171,	'cs',	'Název'),
(172,	'cs',	'Datum'),
(173,	'cs',	'Barva'),
(174,	'cs',	'Priorita'),
(175,	'cs',	'Splněno'),
(176,	'cs',	'Projekt'),
(177,	'cs',	'Úkol'),
(178,	'cs',	'Název'),
(179,	'cs',	'Datum'),
(180,	'cs',	'Barva'),
(181,	'cs',	'Priorita'),
(182,	'cs',	'Splněno'),
(183,	'cs',	'Projekt'),
(184,	'cs',	'Úkol');

DROP TABLE IF EXISTS `generator_module`;
CREATE TABLE `generator_module` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `slug_singular` varchar(255) DEFAULT NULL,
  `slug_plural` varchar(255) DEFAULT NULL,
  `in_menu` tinyint(1) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `sort` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `generator_module` (`id`, `slug_singular`, `slug_plural`, `in_menu`, `icon`, `sort`) VALUES
(1,	'user',	'users',	1,	'user',	0),
(4,	'client',	'clients',	1,	'user',	0),
(5,	'endCustomer',	'endCustomers',	1,	'user',	0),
(6,	'endCustomerContact',	'endCustomerContacts',	1,	'user',	0),
(7,	'project',	'projects',	1,	'',	0),
(8,	'projectStatus',	'projectStatuses',	1,	'',	0),
(9,	'task',	'tasks',	1,	'',	0),
(10,	'taskStatus',	'taskStatuses',	1,	'',	0),
(11,	'projectDate',	'projectDates',	1,	'',	0);

DROP TABLE IF EXISTS `generator_module_translation`;
CREATE TABLE `generator_module_translation` (
  `generator_module_id` int(6) unsigned DEFAULT NULL,
  `language` varchar(5) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  UNIQUE KEY `generator_module_id_language` (`generator_module_id`,`language`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `generator_module_translation` (`generator_module_id`, `language`, `name`) VALUES
(1,	'cs',	'Uživatelé'),
(2,	'cs',	'test'),
(3,	'cs',	'test2'),
(4,	'cs',	'Klient'),
(5,	'cs',	'Koncový zákazník'),
(6,	'cs',	'Koncový zákazník - kontakt'),
(7,	'cs',	'Projekt'),
(8,	'cs',	'Stav projektu'),
(9,	'cs',	'Úkol'),
(10,	'cs',	'Stav úkolu'),
(11,	'cs',	'Datumy projektu');

DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `budget` int(9) DEFAULT NULL,
  `client_id` int(6) unsigned DEFAULT NULL,
  `end_customer_id` int(6) unsigned DEFAULT NULL,
  `hour_rate` int(9) DEFAULT NULL,
  `hour_budget` int(9) DEFAULT NULL,
  `project_status_id` int(6) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `project` (`id`, `name`, `budget`, `client_id`, `end_customer_id`, `hour_rate`, `hour_budget`, `project_status_id`) VALUES
(1,	'Tvorba nového webu',	110400,	1,	1,	400,	276,	3);

DROP TABLE IF EXISTS `projectdate`;
CREATE TABLE `projectdate` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `priority` int(9) DEFAULT NULL,
  `done` tinyint(1) DEFAULT NULL,
  `project_id` int(6) unsigned DEFAULT NULL,
  `task_id` int(6) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `projectdate` (`id`, `name`, `date`, `color`, `priority`, `done`, `project_id`, `task_id`) VALUES
(1,	'Musí bězet',	'2025-01-01',	NULL,	1,	NULL,	1,	NULL);

DROP TABLE IF EXISTS `projectstatus`;
CREATE TABLE `projectstatus` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `priority` int(9) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `projectstatus` (`id`, `name`, `color`, `priority`) VALUES
(1,	'První kontakt',	'',	900),
(2,	'Čeká na nacenění',	'',	800),
(3,	'Naceněno',	'',	700),
(4,	'Čeká se na data od klienta',	'',	600),
(5,	'Rozpracováno',	'',	500),
(6,	'Čeká na kontrolu od zákazníka',	'',	400),
(7,	'K fakturaci',	'',	300),
(8,	'Vyfakturováno',	'',	200),
(9,	'Uzavřeno',	'',	100),
(10,	'Zrušeno',	'',	0);

DROP TABLE IF EXISTS `task`;
CREATE TABLE `task` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `hour_budget` int(9) DEFAULT NULL,
  `project_id` int(6) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `task` (`id`, `name`, `hour_budget`, `project_id`) VALUES
(1,	'Nakódování designu',	80,	1),
(2,	'Instalace a příprava systému',	24,	1),
(3,	'Programování modulů',	110,	1),
(4,	'Migrace dat',	62,	1);

DROP TABLE IF EXISTS `taskstatus`;
CREATE TABLE `taskstatus` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `priority` int(9) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `taskstatus` (`id`, `name`, `color`, `priority`) VALUES
(1,	'Backlog',	'',	900),
(2,	'TODO',	'',	800),
(3,	'Rozpracováno',	'',	700),
(4,	'Čekám na podklady',	'',	600),
(5,	'Hotovo',	'',	500),
(6,	'Zrušeno',	'',	0);

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `surname` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


-- 2024-06-16 18:47:23
