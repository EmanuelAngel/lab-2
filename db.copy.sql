-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 15, 2024 at 02:01 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `agenda_consultorio`
--
CREATE DATABASE IF NOT EXISTS `agenda_consultorio` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `agenda_consultorio`;

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id_admin` int NOT NULL,
  `estado` tinyint NOT NULL,
  `id_usuario` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id_admin`, `estado`, `id_usuario`) VALUES
(1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `agenda_base`
--

CREATE TABLE `agenda_base` (
  `id_agenda_base` int NOT NULL,
  `id_sucursal` int NOT NULL,
  `estado` tinyint NOT NULL DEFAULT '1',
  `id_estado_agenda` int NOT NULL DEFAULT '1',
  `id_clasificacion` int NOT NULL,
  `duracion_turno` int NOT NULL,
  `sobreturnos_maximos` int NOT NULL,
  `matricula` varchar(25) COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `agenda_base`
--

INSERT INTO `agenda_base` (`id_agenda_base`, `id_sucursal`, `estado`, `id_estado_agenda`, `id_clasificacion`, `duracion_turno`, `sobreturnos_maximos`, `matricula`, `createdAt`) VALUES
(1, 1, 1, 2, 1, 20, 2, 'PROF1234', '2024-11-11 20:34:06');

-- --------------------------------------------------------

--
-- Table structure for table `clasificacion_consulta`
--

CREATE TABLE `clasificacion_consulta` (
  `id_clasificacion` int NOT NULL,
  `nombre_clasificacion` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clasificacion_consulta`
--

INSERT INTO `clasificacion_consulta` (`id_clasificacion`, `nombre_clasificacion`, `descripcion`) VALUES
(1, 'Normal', 'Consulta médica general'),
(2, 'Especial', 'Clasificación para consultas especiales con mayor atención.'),
(3, 'VIP', 'Clasificación para pacientes VIP con atención preferencial.');

-- --------------------------------------------------------

--
-- Table structure for table `dias`
--

CREATE TABLE `dias` (
  `id_dia` int NOT NULL,
  `dia` varchar(11) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dias`
--

INSERT INTO `dias` (`id_dia`, `dia`) VALUES
(1, 'Lunes'),
(2, 'Martes'),
(3, 'Miercoles'),
(4, 'Jueves'),
(5, 'Viernes'),
(6, 'Sabado'),
(7, 'Domingo');

-- --------------------------------------------------------

--
-- Table structure for table `dias_agendas`
--

CREATE TABLE `dias_agendas` (
  `id_dia_agenda` int NOT NULL,
  `id_agenda_base` int NOT NULL,
  `id_dia` int NOT NULL,
  `horario_inicio` time NOT NULL,
  `horario_fin` time NOT NULL,
  `estado` tinyint DEFAULT '1',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dias_agendas`
--

INSERT INTO `dias_agendas` (`id_dia_agenda`, `id_agenda_base`, `id_dia`, `horario_inicio`, `horario_fin`, `estado`, `createdAt`) VALUES
(1, 1, 2, '08:00:00', '13:00:00', 1, '2024-11-14 00:07:56'),
(2, 1, 4, '08:00:00', '13:00:00', 1, '2024-11-14 00:07:56'),
(3, 1, 6, '08:00:00', '13:00:00', 1, '2024-11-14 00:07:56'),
(4, 1, 5, '09:00:00', '12:00:00', 1, '2024-11-14 00:09:10'),
(5, 1, 5, '16:00:00', '20:30:00', 1, '2024-11-14 00:09:10');

-- --------------------------------------------------------

--
-- Table structure for table `dias_no_disponibles`
--

CREATE TABLE `dias_no_disponibles` (
  `id_dia_no_disponible` int NOT NULL,
  `id_agenda_base` int NOT NULL,
  `fecha` date NOT NULL,
  `motivo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tipo_bloqueo` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dias_no_disponibles`
--

INSERT INTO `dias_no_disponibles` (`id_dia_no_disponible`, `id_agenda_base`, `fecha`, `motivo`, `tipo_bloqueo`) VALUES
(16, 1, '2024-01-01', 'Año Nuevo', 'feriado'),
(17, 1, '2024-01-06', 'Día de los Reyes', 'feriado'),
(18, 1, '2024-03-24', 'Día de la Memoria por la Verdad y la Justicia', 'feriado'),
(19, 1, '2024-03-28', 'Jueves Santo', 'feriado'),
(20, 1, '2024-03-29', 'Viernes Santo', 'feriado'),
(21, 1, '2024-04-02', 'Día del Veterano y de los Caídos en la Guerra de Malvinas', 'feriado'),
(22, 1, '2024-05-01', 'Día del Trabajo', 'feriado'),
(23, 1, '2024-05-25', 'Revolución de Mayo', 'feriado'),
(24, 1, '2024-06-17', 'Día del Veterano de Güemes', 'feriado'),
(25, 1, '2024-07-09', 'Día de la Independencia', 'feriado'),
(26, 1, '2024-08-20', 'Paso a la Inmortalidad del Gral. San Martín', 'feriado'),
(27, 1, '2024-10-12', 'Día de la Diversidad Cultural', 'feriado'),
(28, 1, '2024-11-20', 'Día de la Soberanía Nacional', 'feriado'),
(29, 1, '2024-12-08', 'Inmaculada Concepción de María', 'feriado'),
(30, 1, '2024-12-25', 'Navidad', 'feriado');

-- --------------------------------------------------------

--
-- Table structure for table `especialidades`
--

CREATE TABLE `especialidades` (
  `id_especialidad` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `estado` tinyint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `especialidades`
--

INSERT INTO `especialidades` (`id_especialidad`, `nombre`, `estado`) VALUES
(1, 'Cardiología', 1),
(2, 'Medicina Clínica', 1),
(3, 'Generalista', 1),
(4, 'Dermatología', 1),
(5, 'Pediatría', 1),
(6, 'Oftalmología', 1),
(8, 'test', 0);

-- --------------------------------------------------------

--
-- Table structure for table `especialidades_profesional`
--

CREATE TABLE `especialidades_profesional` (
  `id_profesional` int NOT NULL,
  `id_especialidad` int NOT NULL,
  `matricula` varchar(25) COLLATE utf8mb4_general_ci NOT NULL,
  `estado` tinyint NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `especialidades_profesional`
--

INSERT INTO `especialidades_profesional` (`id_profesional`, `id_especialidad`, `matricula`, `estado`) VALUES
(1, 1, 'PROF1234', 1),
(1, 2, 'PROF9897', 1),
(1, 3, 'PROF3451', 1),
(2, 2, 'PROF4567', 1),
(2, 5, 'PROF5678', 1),
(3, 1, 'CAR12345', 1),
(4, 2, 'SOSA67890', 1),
(5, 3, 'TORRES11223', 1),
(6, 4, 'PEREZ44556', 1),
(7, 5, 'BENITEZ7788', 1),
(8, 1, 'ALVAREZ99000', 1),
(9, 6, 'OGONZ123', 1),
(10, 6, 'OALVZ123', 1),
(11, 5, 'PGIRA123', 1);

-- --------------------------------------------------------

--
-- Table structure for table `estados_turno`
--

CREATE TABLE `estados_turno` (
  `id_estado_turno` int NOT NULL,
  `nombre_estado` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `estado_activo` tinyint DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `estados_turno`
--

INSERT INTO `estados_turno` (`id_estado_turno`, `nombre_estado`, `estado_activo`) VALUES
(1, 'Confirmado', 1),
(2, 'Libre', 1),
(3, 'Reservada', 1),
(4, 'disponible', 1),
(5, 'Cancelado', 1),
(6, 'Ausente', 1),
(7, 'Presente', 1),
(8, 'En consulta', 1),
(9, 'Atendido', 1),
(10, 'Sobre turno', 1);

-- --------------------------------------------------------

--
-- Table structure for table `estado_agenda`
--

CREATE TABLE `estado_agenda` (
  `id_estado_agenda` int NOT NULL,
  `nombre_estado` varchar(50) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `estado_agenda`
--

INSERT INTO `estado_agenda` (`id_estado_agenda`, `nombre_estado`) VALUES
(1, 'Activa'),
(3, 'Bloqueada'),
(4, 'Finalizada'),
(2, 'Inactiva');

-- --------------------------------------------------------

--
-- Table structure for table `lista_espera`
--

CREATE TABLE `lista_espera` (
  `id_lista_espera` int NOT NULL,
  `fecha_inscripcion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_turno` int NOT NULL,
  `estado` tinyint NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `obra_social`
--

CREATE TABLE `obra_social` (
  `id_obra_social` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `estado` tinyint NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `obra_social`
--

INSERT INTO `obra_social` (`id_obra_social`, `nombre`, `estado`) VALUES
(1, 'DOSEP', 1),
(2, 'DOSPU', 1),
(3, 'SWISS MEDICAL', 1),
(4, 'MediSaludSanLuis', 1),
(5, 'Obra Social Provincial San Luis', 1),
(6, 'PRUEBA', 1);

-- --------------------------------------------------------

--
-- Table structure for table `obra_social_paciente`
--

CREATE TABLE `obra_social_paciente` (
  `id_paciente` int NOT NULL,
  `id_obra_social` int NOT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `estado` tinyint NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `obra_social_paciente`
--

INSERT INTO `obra_social_paciente` (`id_paciente`, `id_obra_social`, `updatedAt`, `estado`) VALUES
(5, 1, '2024-11-11 00:21:57', 1),
(5, 2, '2024-11-11 00:21:57', 1),
(20, 1, '2024-11-11 00:22:50', 1),
(20, 2, '2024-11-11 00:22:50', 1),
(21, 1, '2024-10-27 15:45:03', 1),
(22, 3, '2024-10-27 15:45:03', 1),
(24, 1, '2024-11-11 00:32:41', 0),
(24, 2, '2024-11-11 19:12:39', 0),
(24, 4, '2024-11-11 19:12:39', 1),
(26, 1, '2024-10-27 21:08:19', 1),
(29, 6, '2024-11-11 19:31:22', 0),
(32, 1, '2024-10-27 21:08:19', 1),
(37, 3, '2024-11-09 01:09:26', 1),
(39, 1, '2024-11-09 01:18:34', 1),
(39, 2, '2024-11-09 01:18:34', 1),
(41, 1, '2024-11-10 01:52:25', 1),
(41, 3, '2024-11-10 01:52:25', 1);

-- --------------------------------------------------------

--
-- Table structure for table `pacientes`
--

CREATE TABLE `pacientes` (
  `id_paciente` int NOT NULL,
  `tiene_obra_social` tinyint NOT NULL,
  `estado` tinyint NOT NULL,
  `id_usuario` int NOT NULL,
  `fotocopia_dni` longblob
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pacientes`
--

INSERT INTO `pacientes` (`id_paciente`, `tiene_obra_social`, `estado`, `id_usuario`, `fotocopia_dni`) VALUES
(5, 1, 1, 51, NULL),
(20, 1, 1, 6, NULL),
(21, 1, 1, 37, NULL),
(22, 1, 1, 38, NULL),
(23, 0, 1, 39, NULL),
(24, 1, 1, 40, NULL),
(25, 0, 1, 41, NULL),
(26, 1, 1, 42, NULL),
(27, 0, 1, 43, NULL),
(28, 1, 1, 44, NULL),
(29, 0, 1, 45, NULL),
(31, 0, 1, 47, NULL),
(32, 1, 1, 48, NULL),
(33, 0, 1, 49, NULL),
(37, 1, 1, 64, NULL),
(38, 0, 1, 65, NULL),
(39, 1, 1, 67, NULL),
(40, 0, 1, 68, NULL),
(41, 1, 1, 71, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `profesionales`
--

CREATE TABLE `profesionales` (
  `id_profesional` int NOT NULL,
  `estado` tinyint NOT NULL,
  `id_usuario` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profesionales`
--

INSERT INTO `profesionales` (`id_profesional`, `estado`, `id_usuario`) VALUES
(1, 1, 4),
(2, 1, 5),
(3, 1, 52),
(4, 1, 53),
(5, 1, 54),
(6, 1, 55),
(7, 1, 56),
(8, 1, 57),
(9, 1, 3),
(10, 1, 46),
(11, 1, 50);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id_rol` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`, `descripcion`) VALUES
(1, 'Admin', 'Administrador del sistema'),
(2, 'Secretario', 'Asistente administrativo'),
(3, 'Profesional', 'Médico profesional'),
(4, 'Paciente', 'Usuario del sistema como paciente'),
(6, 'probando funcionamiento parcial', 'probando 123456');

-- --------------------------------------------------------

--
-- Table structure for table `secre`
--

CREATE TABLE `secre` (
  `id_secre` int NOT NULL,
  `estado` tinyint NOT NULL,
  `id_usuario` int NOT NULL,
  `id_sucursal` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `secre`
--

INSERT INTO `secre` (`id_secre`, `estado`, `id_usuario`, `id_sucursal`) VALUES
(1, 1, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `sucursal`
--

CREATE TABLE `sucursal` (
  `id_sucursal` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `estado` tinyint NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sucursal`
--

INSERT INTO `sucursal` (`id_sucursal`, `nombre`, `direccion`, `telefono`, `email`, `estado`) VALUES
(1, 'Clínica San Luis', 'Calle probando 123, San Luis', '4454041', 'clinica_sanluis@gmail.com', 1),
(2, 'Sucursal Central prueba2', 'Av. Perón 123, San Luis, San Luis', '+549266456789', 'sucursalcentral@prueba.com', 1);

-- --------------------------------------------------------

--
-- Table structure for table `turnos`
--

CREATE TABLE `turnos` (
  `id_turno` int NOT NULL,
  `id_agenda_base` int NOT NULL,
  `id_paciente` int DEFAULT NULL,
  `id_estado_turno` int NOT NULL,
  `fecha` date NOT NULL,
  `horario_inicio` time NOT NULL,
  `horario_fin` time NOT NULL,
  `motivo_consulta` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `turnos`
--

INSERT INTO `turnos` (`id_turno`, `id_agenda_base`, `id_paciente`, `id_estado_turno`, `fecha`, `horario_inicio`, `horario_fin`, `motivo_consulta`) VALUES
(114, 1, 33, 1, '2024-12-02', '08:00:00', '08:20:00', ''),
(115, 1, 33, 1, '2024-12-02', '08:20:00', '08:40:00', 'test'),
(116, 1, NULL, 2, '2024-12-02', '08:40:00', '09:00:00', NULL),
(117, 1, NULL, 2, '2024-12-02', '09:00:00', '09:20:00', NULL),
(118, 1, NULL, 2, '2024-12-02', '09:20:00', '09:40:00', NULL),
(119, 1, 29, 1, '2024-12-02', '09:40:00', '10:00:00', 'Messi'),
(120, 1, NULL, 2, '2024-12-02', '10:00:00', '10:20:00', NULL),
(121, 1, NULL, 2, '2024-12-02', '10:20:00', '10:40:00', NULL),
(122, 1, NULL, 2, '2024-12-02', '10:40:00', '11:00:00', NULL),
(123, 1, NULL, 2, '2024-12-02', '11:00:00', '11:20:00', NULL),
(124, 1, NULL, 2, '2024-12-02', '11:20:00', '11:40:00', NULL),
(125, 1, NULL, 2, '2024-12-02', '11:40:00', '12:00:00', NULL),
(126, 1, NULL, 2, '2024-12-02', '12:00:00', '12:20:00', NULL),
(127, 1, NULL, 2, '2024-12-02', '12:20:00', '12:40:00', NULL),
(128, 1, NULL, 2, '2024-12-02', '12:40:00', '13:00:00', NULL),
(129, 1, 24, 1, '2024-12-04', '08:00:00', '08:20:00', 'Algo algo algo algo algo'),
(130, 1, NULL, 2, '2024-12-04', '08:20:00', '08:40:00', NULL),
(131, 1, NULL, 2, '2024-12-04', '08:40:00', '09:00:00', NULL),
(132, 1, NULL, 2, '2024-12-04', '09:00:00', '09:20:00', NULL),
(133, 1, NULL, 2, '2024-12-04', '09:20:00', '09:40:00', NULL),
(134, 1, NULL, 2, '2024-12-04', '09:40:00', '10:00:00', NULL),
(135, 1, NULL, 2, '2024-12-04', '10:00:00', '10:20:00', NULL),
(136, 1, NULL, 2, '2024-12-04', '10:20:00', '10:40:00', NULL),
(137, 1, NULL, 2, '2024-12-04', '10:40:00', '11:00:00', NULL),
(138, 1, NULL, 2, '2024-12-04', '11:00:00', '11:20:00', NULL),
(139, 1, NULL, 2, '2024-12-04', '11:20:00', '11:40:00', NULL),
(140, 1, NULL, 2, '2024-12-04', '11:40:00', '12:00:00', NULL),
(141, 1, NULL, 2, '2024-12-04', '12:00:00', '12:20:00', NULL),
(142, 1, NULL, 2, '2024-12-04', '12:20:00', '12:40:00', NULL),
(143, 1, NULL, 2, '2024-12-04', '12:40:00', '13:00:00', NULL),
(144, 1, NULL, 2, '2024-12-05', '09:00:00', '09:20:00', NULL),
(145, 1, NULL, 2, '2024-12-05', '09:20:00', '09:40:00', NULL),
(146, 1, NULL, 2, '2024-12-05', '09:40:00', '10:00:00', NULL),
(147, 1, NULL, 2, '2024-12-05', '10:00:00', '10:20:00', NULL),
(148, 1, NULL, 2, '2024-12-05', '10:20:00', '10:40:00', NULL),
(149, 1, NULL, 2, '2024-12-05', '10:40:00', '11:00:00', NULL),
(150, 1, NULL, 2, '2024-12-05', '11:00:00', '11:20:00', NULL),
(151, 1, NULL, 2, '2024-12-05', '11:20:00', '11:40:00', NULL),
(152, 1, NULL, 2, '2024-12-05', '11:40:00', '12:00:00', NULL),
(153, 1, NULL, 2, '2024-12-05', '16:00:00', '16:20:00', NULL),
(154, 1, NULL, 2, '2024-12-05', '16:20:00', '16:40:00', NULL),
(155, 1, NULL, 2, '2024-12-05', '16:40:00', '17:00:00', NULL),
(156, 1, NULL, 2, '2024-12-05', '17:00:00', '17:20:00', NULL),
(157, 1, NULL, 2, '2024-12-05', '17:20:00', '17:40:00', NULL),
(158, 1, NULL, 2, '2024-12-05', '17:40:00', '18:00:00', NULL),
(159, 1, NULL, 2, '2024-12-05', '18:00:00', '18:20:00', NULL),
(160, 1, NULL, 2, '2024-12-05', '18:20:00', '18:40:00', NULL),
(161, 1, NULL, 2, '2024-12-05', '18:40:00', '19:00:00', NULL),
(162, 1, NULL, 2, '2024-12-05', '19:00:00', '19:20:00', NULL),
(163, 1, NULL, 2, '2024-12-05', '19:20:00', '19:40:00', NULL),
(164, 1, NULL, 2, '2024-12-05', '19:40:00', '20:00:00', NULL),
(165, 1, NULL, 2, '2024-12-05', '20:00:00', '20:20:00', NULL),
(166, 1, NULL, 2, '2024-12-06', '08:00:00', '08:20:00', NULL),
(167, 1, NULL, 2, '2024-12-06', '08:20:00', '08:40:00', NULL),
(168, 1, NULL, 2, '2024-12-06', '08:40:00', '09:00:00', NULL),
(169, 1, NULL, 2, '2024-12-06', '09:00:00', '09:20:00', NULL),
(170, 1, NULL, 2, '2024-12-06', '09:20:00', '09:40:00', NULL),
(171, 1, NULL, 2, '2024-12-06', '09:40:00', '10:00:00', NULL),
(172, 1, NULL, 2, '2024-12-06', '10:00:00', '10:20:00', NULL),
(173, 1, NULL, 2, '2024-12-06', '10:20:00', '10:40:00', NULL),
(174, 1, NULL, 2, '2024-12-06', '10:40:00', '11:00:00', NULL),
(175, 1, NULL, 2, '2024-12-06', '11:00:00', '11:20:00', NULL),
(176, 1, NULL, 2, '2024-12-06', '11:20:00', '11:40:00', NULL),
(177, 1, NULL, 2, '2024-12-06', '11:40:00', '12:00:00', NULL),
(178, 1, NULL, 2, '2024-12-06', '12:00:00', '12:20:00', NULL),
(179, 1, NULL, 2, '2024-12-06', '12:20:00', '12:40:00', NULL),
(180, 1, NULL, 2, '2024-12-06', '12:40:00', '13:00:00', NULL),
(181, 1, NULL, 2, '2024-12-09', '08:00:00', '08:20:00', NULL),
(182, 1, NULL, 2, '2024-12-09', '08:20:00', '08:40:00', NULL),
(183, 1, NULL, 2, '2024-12-09', '08:40:00', '09:00:00', NULL),
(184, 1, NULL, 2, '2024-12-09', '09:00:00', '09:20:00', NULL),
(185, 1, NULL, 2, '2024-12-09', '09:20:00', '09:40:00', NULL),
(186, 1, NULL, 2, '2024-12-09', '09:40:00', '10:00:00', NULL),
(187, 1, NULL, 2, '2024-12-09', '10:00:00', '10:20:00', NULL),
(188, 1, NULL, 2, '2024-12-09', '10:20:00', '10:40:00', NULL),
(189, 1, NULL, 2, '2024-12-09', '10:40:00', '11:00:00', NULL),
(190, 1, NULL, 2, '2024-12-09', '11:00:00', '11:20:00', NULL),
(191, 1, NULL, 2, '2024-12-09', '11:20:00', '11:40:00', NULL),
(192, 1, NULL, 2, '2024-12-09', '11:40:00', '12:00:00', NULL),
(193, 1, NULL, 2, '2024-12-09', '12:00:00', '12:20:00', NULL),
(194, 1, NULL, 2, '2024-12-09', '12:20:00', '12:40:00', NULL),
(195, 1, NULL, 2, '2024-12-09', '12:40:00', '13:00:00', NULL),
(196, 1, NULL, 2, '2024-12-11', '08:00:00', '08:20:00', NULL),
(197, 1, NULL, 2, '2024-12-11', '08:20:00', '08:40:00', NULL),
(198, 1, NULL, 2, '2024-12-11', '08:40:00', '09:00:00', NULL),
(199, 1, NULL, 2, '2024-12-11', '09:00:00', '09:20:00', NULL),
(200, 1, NULL, 2, '2024-12-11', '09:20:00', '09:40:00', NULL),
(201, 1, NULL, 2, '2024-12-11', '09:40:00', '10:00:00', NULL),
(202, 1, NULL, 2, '2024-12-11', '10:00:00', '10:20:00', NULL),
(203, 1, NULL, 2, '2024-12-11', '10:20:00', '10:40:00', NULL),
(204, 1, NULL, 2, '2024-12-11', '10:40:00', '11:00:00', NULL),
(205, 1, NULL, 2, '2024-12-11', '11:00:00', '11:20:00', NULL),
(206, 1, NULL, 2, '2024-12-11', '11:20:00', '11:40:00', NULL),
(207, 1, NULL, 2, '2024-12-11', '11:40:00', '12:00:00', NULL),
(208, 1, NULL, 2, '2024-12-11', '12:00:00', '12:20:00', NULL),
(209, 1, NULL, 2, '2024-12-11', '12:20:00', '12:40:00', NULL),
(210, 1, NULL, 2, '2024-12-11', '12:40:00', '13:00:00', NULL),
(211, 1, NULL, 2, '2024-12-12', '09:00:00', '09:20:00', NULL),
(212, 1, NULL, 2, '2024-12-12', '09:20:00', '09:40:00', NULL),
(213, 1, NULL, 2, '2024-12-12', '09:40:00', '10:00:00', NULL),
(214, 1, NULL, 2, '2024-12-12', '10:00:00', '10:20:00', NULL),
(215, 1, NULL, 2, '2024-12-12', '10:20:00', '10:40:00', NULL),
(216, 1, NULL, 2, '2024-12-12', '10:40:00', '11:00:00', NULL),
(217, 1, NULL, 2, '2024-12-12', '11:00:00', '11:20:00', NULL),
(218, 1, NULL, 2, '2024-12-12', '11:20:00', '11:40:00', NULL),
(219, 1, NULL, 2, '2024-12-12', '11:40:00', '12:00:00', NULL),
(220, 1, NULL, 2, '2024-12-12', '16:00:00', '16:20:00', NULL),
(221, 1, NULL, 2, '2024-12-12', '16:20:00', '16:40:00', NULL),
(222, 1, NULL, 2, '2024-12-12', '16:40:00', '17:00:00', NULL),
(223, 1, NULL, 2, '2024-12-12', '17:00:00', '17:20:00', NULL),
(224, 1, NULL, 2, '2024-12-12', '17:20:00', '17:40:00', NULL),
(225, 1, NULL, 2, '2024-12-12', '17:40:00', '18:00:00', NULL),
(226, 1, NULL, 2, '2024-12-12', '18:00:00', '18:20:00', NULL),
(227, 1, NULL, 2, '2024-12-12', '18:20:00', '18:40:00', NULL),
(228, 1, NULL, 2, '2024-12-12', '18:40:00', '19:00:00', NULL),
(229, 1, NULL, 2, '2024-12-12', '19:00:00', '19:20:00', NULL),
(230, 1, NULL, 2, '2024-12-12', '19:20:00', '19:40:00', NULL),
(231, 1, NULL, 2, '2024-12-12', '19:40:00', '20:00:00', NULL),
(232, 1, NULL, 2, '2024-12-12', '20:00:00', '20:20:00', NULL),
(233, 1, NULL, 2, '2024-12-13', '08:00:00', '08:20:00', NULL),
(234, 1, NULL, 2, '2024-12-13', '08:20:00', '08:40:00', NULL),
(235, 1, NULL, 2, '2024-12-13', '08:40:00', '09:00:00', NULL),
(236, 1, NULL, 2, '2024-12-13', '09:00:00', '09:20:00', NULL),
(237, 1, NULL, 2, '2024-12-13', '09:20:00', '09:40:00', NULL),
(238, 1, NULL, 2, '2024-12-13', '09:40:00', '10:00:00', NULL),
(239, 1, NULL, 2, '2024-12-13', '10:00:00', '10:20:00', NULL),
(240, 1, NULL, 2, '2024-12-13', '10:20:00', '10:40:00', NULL),
(241, 1, NULL, 2, '2024-12-13', '10:40:00', '11:00:00', NULL),
(242, 1, NULL, 2, '2024-12-13', '11:00:00', '11:20:00', NULL),
(243, 1, NULL, 2, '2024-12-13', '11:20:00', '11:40:00', NULL),
(244, 1, NULL, 2, '2024-12-13', '11:40:00', '12:00:00', NULL),
(245, 1, NULL, 2, '2024-12-13', '12:00:00', '12:20:00', NULL),
(246, 1, NULL, 2, '2024-12-13', '12:20:00', '12:40:00', NULL),
(247, 1, NULL, 2, '2024-12-13', '12:40:00', '13:00:00', NULL),
(248, 1, NULL, 2, '2024-12-16', '08:00:00', '08:20:00', NULL),
(249, 1, NULL, 2, '2024-12-16', '08:20:00', '08:40:00', NULL),
(250, 1, NULL, 2, '2024-12-16', '08:40:00', '09:00:00', NULL),
(251, 1, NULL, 2, '2024-12-16', '09:00:00', '09:20:00', NULL),
(252, 1, NULL, 2, '2024-12-16', '09:20:00', '09:40:00', NULL),
(253, 1, NULL, 2, '2024-12-16', '09:40:00', '10:00:00', NULL),
(254, 1, NULL, 2, '2024-12-16', '10:00:00', '10:20:00', NULL),
(255, 1, NULL, 2, '2024-12-16', '10:20:00', '10:40:00', NULL),
(256, 1, NULL, 2, '2024-12-16', '10:40:00', '11:00:00', NULL),
(257, 1, NULL, 2, '2024-12-16', '11:00:00', '11:20:00', NULL),
(258, 1, NULL, 2, '2024-12-16', '11:20:00', '11:40:00', NULL),
(259, 1, NULL, 2, '2024-12-16', '11:40:00', '12:00:00', NULL),
(260, 1, NULL, 2, '2024-12-16', '12:00:00', '12:20:00', NULL),
(261, 1, NULL, 2, '2024-12-16', '12:20:00', '12:40:00', NULL),
(262, 1, NULL, 2, '2024-12-16', '12:40:00', '13:00:00', NULL),
(263, 1, NULL, 2, '2024-12-18', '08:00:00', '08:20:00', NULL),
(264, 1, NULL, 2, '2024-12-18', '08:20:00', '08:40:00', NULL),
(265, 1, NULL, 2, '2024-12-18', '08:40:00', '09:00:00', NULL),
(266, 1, NULL, 2, '2024-12-18', '09:00:00', '09:20:00', NULL),
(267, 1, NULL, 2, '2024-12-18', '09:20:00', '09:40:00', NULL),
(268, 1, NULL, 2, '2024-12-18', '09:40:00', '10:00:00', NULL),
(269, 1, NULL, 2, '2024-12-18', '10:00:00', '10:20:00', NULL),
(270, 1, NULL, 2, '2024-12-18', '10:20:00', '10:40:00', NULL),
(271, 1, NULL, 2, '2024-12-18', '10:40:00', '11:00:00', NULL),
(272, 1, NULL, 2, '2024-12-18', '11:00:00', '11:20:00', NULL),
(273, 1, NULL, 2, '2024-12-18', '11:20:00', '11:40:00', NULL),
(274, 1, NULL, 2, '2024-12-18', '11:40:00', '12:00:00', NULL),
(275, 1, NULL, 2, '2024-12-18', '12:00:00', '12:20:00', NULL),
(276, 1, NULL, 2, '2024-12-18', '12:20:00', '12:40:00', NULL),
(277, 1, NULL, 2, '2024-12-18', '12:40:00', '13:00:00', NULL),
(278, 1, NULL, 2, '2024-12-19', '09:00:00', '09:20:00', NULL),
(279, 1, NULL, 2, '2024-12-19', '09:20:00', '09:40:00', NULL),
(280, 1, NULL, 2, '2024-12-19', '09:40:00', '10:00:00', NULL),
(281, 1, NULL, 2, '2024-12-19', '10:00:00', '10:20:00', NULL),
(282, 1, NULL, 2, '2024-12-19', '10:20:00', '10:40:00', NULL),
(283, 1, NULL, 2, '2024-12-19', '10:40:00', '11:00:00', NULL),
(284, 1, NULL, 2, '2024-12-19', '11:00:00', '11:20:00', NULL),
(285, 1, NULL, 2, '2024-12-19', '11:20:00', '11:40:00', NULL),
(286, 1, NULL, 2, '2024-12-19', '11:40:00', '12:00:00', NULL),
(287, 1, NULL, 2, '2024-12-19', '16:00:00', '16:20:00', NULL),
(288, 1, NULL, 2, '2024-12-19', '16:20:00', '16:40:00', NULL),
(289, 1, NULL, 2, '2024-12-19', '16:40:00', '17:00:00', NULL),
(290, 1, NULL, 2, '2024-12-19', '17:00:00', '17:20:00', NULL),
(291, 1, NULL, 2, '2024-12-19', '17:20:00', '17:40:00', NULL),
(292, 1, NULL, 2, '2024-12-19', '17:40:00', '18:00:00', NULL),
(293, 1, NULL, 2, '2024-12-19', '18:00:00', '18:20:00', NULL),
(294, 1, NULL, 2, '2024-12-19', '18:20:00', '18:40:00', NULL),
(295, 1, NULL, 2, '2024-12-19', '18:40:00', '19:00:00', NULL),
(296, 1, NULL, 2, '2024-12-19', '19:00:00', '19:20:00', NULL),
(297, 1, NULL, 2, '2024-12-19', '19:20:00', '19:40:00', NULL),
(298, 1, NULL, 2, '2024-12-19', '19:40:00', '20:00:00', NULL),
(299, 1, NULL, 2, '2024-12-19', '20:00:00', '20:20:00', NULL),
(300, 1, NULL, 2, '2024-12-20', '08:00:00', '08:20:00', NULL),
(301, 1, NULL, 2, '2024-12-20', '08:20:00', '08:40:00', NULL),
(302, 1, NULL, 2, '2024-12-20', '08:40:00', '09:00:00', NULL),
(303, 1, NULL, 2, '2024-12-20', '09:00:00', '09:20:00', NULL),
(304, 1, NULL, 2, '2024-12-20', '09:20:00', '09:40:00', NULL),
(305, 1, NULL, 2, '2024-12-20', '09:40:00', '10:00:00', NULL),
(306, 1, NULL, 2, '2024-12-20', '10:00:00', '10:20:00', NULL),
(307, 1, NULL, 2, '2024-12-20', '10:20:00', '10:40:00', NULL),
(308, 1, NULL, 2, '2024-12-20', '10:40:00', '11:00:00', NULL),
(309, 1, NULL, 2, '2024-12-20', '11:00:00', '11:20:00', NULL),
(310, 1, NULL, 2, '2024-12-20', '11:20:00', '11:40:00', NULL),
(311, 1, NULL, 2, '2024-12-20', '11:40:00', '12:00:00', NULL),
(312, 1, NULL, 2, '2024-12-20', '12:00:00', '12:20:00', NULL),
(313, 1, NULL, 2, '2024-12-20', '12:20:00', '12:40:00', NULL),
(314, 1, NULL, 2, '2024-12-20', '12:40:00', '13:00:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL,
  `id_rol` int NOT NULL,
  `nombre_usuario` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `contraseña` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `dni` int NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `estado` tinyint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `id_rol`, `nombre_usuario`, `contraseña`, `nombre`, `apellido`, `dni`, `telefono`, `direccion`, `email`, `estado`) VALUES
(1, 1, 'admin_sanluis', 'password123', 'María', 'Pérez', 30123406, '2147483647', 'Calle Falsa 123, San Luis', 'mariaperez@gmail.com', 1),
(2, 2, 'sec_jimenez', 'pass456', 'Roberto', 'Jiménez', 32123456, '2147483647', 'Av. Libertador 456, San Luis', 'robertosecretario@gmail.com', 1),
(3, 3, 'dr_gonzalez', 'medico2024', 'Jorge', 'González', 33123456, '2147483647', 'Calle Salud 789, San Luis', 'doctorjorge@gmail.com', 1),
(4, 3, 'dra_morales', 'miPass2024', 'Ana', 'Morales', 34123456, '2147483647', 'Calle Bienestar 321, San Luis', 'anamorales@gmail.com', 1),
(5, 3, 'dr_fernandez', 'doc_f2024', 'Laura', 'Fernández', 35123456, '2147483647', 'Av. Medicina 654, San Luis', 'laurafernandez@gmail.com', 1),
(6, 4, 'Nico123', '$2b$10$9s0gKjLV1pOEzm1X6zVBW.sZy93/I.4f2XYGXTKMKbOKhcKlnhWHm', 'Pedrito', 'Pedrito', 12345699, '12345678', 'C/ Juan Seba, 1', 'perez@example.com', 1),
(37, 4, 'juanperez', 'password123', 'Juan', 'Perez', 30123456, '2147483647', 'Calle Falsa 123', 'juanperez@gmail.com', 1),
(38, 4, 'mariagarcia', 'password123', 'Maria', 'Garcia', 31123457, '2147483647', 'Av. Libertad 456', 'mariagarcia@hotmail.com', 1),
(39, 4, 'pedrorodriguez', 'password123', 'Pedro', 'Rodriguez', 32123458, '2147483647', 'Calle Mitre 789', 'pedrorodriguez@gmail.com', 1),
(40, 4, 'analopez', '$2b$10$a3LEGEcx4Dorq.WYKxu5e.xdqQy8tgRBpHs5fVjgx8XFHxCRjHWXO', 'Ana', 'López', 12345699, '12345678', 'C/ Juan Seba, 1', 'analopez@hotmail.com', 1),
(41, 4, 'lucasgonzalez', 'password123', 'Lucas', 'Gonzalez', 34123460, '2147483647', 'Calle Moreno 202', 'lucasgonzalez@gmail.com', 1),
(42, 4, 'sofiamartinez', 'password123', 'Sofia', 'Martinez', 35123461, '2147483647', 'Calle Belgrano 303', 'sofiamartinez@hotmail.com', 1),
(43, 4, 'manuelgomez', 'password123', 'Manuel', 'Gomez', 36123462, '2147483647', 'Av. España 404', 'manuelgomez@gmail.com', 1),
(44, 4, 'valentinasanchez', 'password123', 'Valentina', 'Sanchez', 37123463, '2147483647', 'Calle Rivadavia 505', 'valentinasanchez@hotmail.com', 1),
(45, 4, 'carloramos', 'password123', 'Carlo', 'Ramos', 38123464, '2147483647', 'Av. Pringles 606', 'carloramos@gmail.com', 1),
(46, 3, 'danielalvarez', 'password123', 'Daniel', 'Alvarez', 39123465, '2147483611', 'Calle Colon 707', 'danielalvarez@hotmail.com', 1),
(47, 4, 'martinfernandez', 'password123', 'Martin', 'Fernandez', 40123466, '2147483647', 'Calle Sarmiento 808', 'martinfernandez@gmail.com', 1),
(48, 4, 'giseladiaz', 'password123', 'Gisela', 'Diaz', 41123467, '2147483647', 'Av. Illia 909', 'giseladiaz@hotmail.com', 1),
(49, 4, 'robertoperez', 'password123', 'Roberto', 'Perez', 42123468, '2147483647', 'Calle Lavalle 1010', 'robertoperez@gmail.com', 1),
(50, 3, 'claragiraldo', 'password123', 'Clara', 'Giraldo', 43123469, '2147483649', 'Calle Saavedra 1111', 'claragiraldo@hotmail.com', 1),
(51, 4, 'franciscoruiz', '$2b$10$EhfR9ZI5.mrluFxdbopSt.Yw.ZZh.K7HgtEFZkT5V1ARspTfThBQC', 'Pedrito', 'Pedrito', 12345699, '12345678', 'C/ Juan Seba, 1', 'franciscoruiz@gmail.com', 1),
(52, 3, 'dr_martinez', 'pass1234', 'Carlos', 'Martínez', 40123468, '1234567890', 'Av. Libertad 123', 'carlosmartinez@gmail.com', 1),
(53, 3, 'dr_sosa', 'pass5678', 'Ana', 'Sosa', 41123469, '1234567891', 'Calle Nueva 456', 'anasosa@gmail.com', 1),
(54, 3, 'dr_torres', 'pass9101', 'Roberto', 'Torres', 42123470, '1234567892', 'Calle Vieja 789', 'robertotorres@gmail.com', 1),
(55, 3, 'dr_perez', 'pass1121', 'Lucía', 'Pérez', 43123471, '1234567893', 'Calle Sol 101', 'luciaperez@gmail.com', 1),
(56, 3, 'dr_benitez', 'pass3141', 'Sergio', 'Benítez', 44123472, '1234567894', 'Calle Luna 202', 'sergiobenitez@gmail.com', 1),
(57, 3, 'dr_alvarez', 'pass5161', 'María', 'Álvarez', 45123473, '1234567895', 'Calle Estrella 303', 'mariaalvarez@gmail.com', 1),
(64, 4, 'Pere', '$2b$10$5f8f23BvUc5AjBb.t7mpiOoJt87uW4YtMDo.51fs4B8Z19hCBePWy', 'Pere', 'Pere', 12345699, '12345678', 'C/ Juan Perez, 1', 'PerePere@gmail.com', 1),
(65, 4, 'Seba', '$2b$10$uUeDa5I/suWLJ6ELQwUAwu.dYBS1bg6sCVsfdgDanmVBA5Z/Pw2im', 'Seba', 'Seba', 12345699, '12345678', 'C/ Juan Seba, 1', 'SebaSeba@gmail.com', 1),
(67, 4, 'Pedrito', '$2b$10$ZcDNtDNymZMOVVNaaTIXsehXhZnAQUzs1RjsNUh3wJkjTEa6mdhEu', 'Pedrito', 'Pedrito', 12345699, '12345678', 'C/ Juan Seba, 1', 'PedritoPedrito@gmail.com', 1),
(68, 4, 'TESTPR', '$2b$10$bcx1W2Yd5JUt7icWHGSw7eiuCQcqCmO3VDsmVwvTCtn/FzRHyIv1y', 'PACIENTE1', 'REGISTRO', 33666999, '121212', 'En algún lugar', 'TESTPACIENTE@gmail.com', 1),
(71, 4, 'TESTPR3', '$2b$10$K4KhDbs74TndkX5Lf.zy..gFaAIjgf0k32wKxp5oFUKmDzpJBN572', 'PACIENTE3', 'REGISTRO3', 44600506, '121212', 'En algún lugar', 'TESTPACIENTE3@gmail.com', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id_admin`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indexes for table `agenda_base`
--
ALTER TABLE `agenda_base`
  ADD PRIMARY KEY (`id_agenda_base`),
  ADD KEY `id_sucursal` (`id_sucursal`),
  ADD KEY `id_estado_agenda` (`id_estado_agenda`),
  ADD KEY `id_clasificacion` (`id_clasificacion`),
  ADD KEY `matricula` (`matricula`);

--
-- Indexes for table `clasificacion_consulta`
--
ALTER TABLE `clasificacion_consulta`
  ADD PRIMARY KEY (`id_clasificacion`);

--
-- Indexes for table `dias`
--
ALTER TABLE `dias`
  ADD PRIMARY KEY (`id_dia`);

--
-- Indexes for table `dias_agendas`
--
ALTER TABLE `dias_agendas`
  ADD PRIMARY KEY (`id_dia_agenda`),
  ADD KEY `id_dia` (`id_dia`),
  ADD KEY `idx_agenda_dia` (`id_agenda_base`,`id_dia`);

--
-- Indexes for table `dias_no_disponibles`
--
ALTER TABLE `dias_no_disponibles`
  ADD PRIMARY KEY (`id_dia_no_disponible`),
  ADD KEY `idx_dias_no_disponibles_agenda` (`id_agenda_base`),
  ADD KEY `idx_fecha` (`fecha`);

--
-- Indexes for table `especialidades`
--
ALTER TABLE `especialidades`
  ADD PRIMARY KEY (`id_especialidad`);

--
-- Indexes for table `especialidades_profesional`
--
ALTER TABLE `especialidades_profesional`
  ADD PRIMARY KEY (`id_profesional`,`id_especialidad`),
  ADD KEY `id_especialidad` (`id_especialidad`),
  ADD KEY `matricula` (`matricula`);

--
-- Indexes for table `estados_turno`
--
ALTER TABLE `estados_turno`
  ADD PRIMARY KEY (`id_estado_turno`);

--
-- Indexes for table `estado_agenda`
--
ALTER TABLE `estado_agenda`
  ADD PRIMARY KEY (`id_estado_agenda`),
  ADD UNIQUE KEY `nombre_estado` (`nombre_estado`);

--
-- Indexes for table `lista_espera`
--
ALTER TABLE `lista_espera`
  ADD PRIMARY KEY (`id_lista_espera`),
  ADD KEY `id_turno` (`id_turno`);

--
-- Indexes for table `obra_social`
--
ALTER TABLE `obra_social`
  ADD PRIMARY KEY (`id_obra_social`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indexes for table `obra_social_paciente`
--
ALTER TABLE `obra_social_paciente`
  ADD PRIMARY KEY (`id_paciente`,`id_obra_social`),
  ADD KEY `id_obra_social` (`id_obra_social`),
  ADD KEY `id_paciente` (`id_paciente`);

--
-- Indexes for table `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id_paciente`),
  ADD UNIQUE KEY `id_usuario` (`id_usuario`);

--
-- Indexes for table `profesionales`
--
ALTER TABLE `profesionales`
  ADD PRIMARY KEY (`id_profesional`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indexes for table `secre`
--
ALTER TABLE `secre`
  ADD PRIMARY KEY (`id_secre`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_sucursal` (`id_sucursal`);

--
-- Indexes for table `sucursal`
--
ALTER TABLE `sucursal`
  ADD PRIMARY KEY (`id_sucursal`);

--
-- Indexes for table `turnos`
--
ALTER TABLE `turnos`
  ADD PRIMARY KEY (`id_turno`),
  ADD KEY `id_agenda_base` (`id_agenda_base`),
  ADD KEY `id_paciente` (`id_paciente`),
  ADD KEY `id_estado_turno` (`id_estado_turno`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `nombre_usuario` (`nombre_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `id_rol` (`id_rol`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id_admin` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `agenda_base`
--
ALTER TABLE `agenda_base`
  MODIFY `id_agenda_base` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `clasificacion_consulta`
--
ALTER TABLE `clasificacion_consulta`
  MODIFY `id_clasificacion` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `dias`
--
ALTER TABLE `dias`
  MODIFY `id_dia` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `dias_agendas`
--
ALTER TABLE `dias_agendas`
  MODIFY `id_dia_agenda` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `dias_no_disponibles`
--
ALTER TABLE `dias_no_disponibles`
  MODIFY `id_dia_no_disponible` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `id_especialidad` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `estados_turno`
--
ALTER TABLE `estados_turno`
  MODIFY `id_estado_turno` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `estado_agenda`
--
ALTER TABLE `estado_agenda`
  MODIFY `id_estado_agenda` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `lista_espera`
--
ALTER TABLE `lista_espera`
  MODIFY `id_lista_espera` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `obra_social`
--
ALTER TABLE `obra_social`
  MODIFY `id_obra_social` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id_paciente` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `profesionales`
--
ALTER TABLE `profesionales`
  MODIFY `id_profesional` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `secre`
--
ALTER TABLE `secre`
  MODIFY `id_secre` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `sucursal`
--
ALTER TABLE `sucursal`
  MODIFY `id_sucursal` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id_turno` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=315;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Constraints for table `agenda_base`
--
ALTER TABLE `agenda_base`
  ADD CONSTRAINT `agenda_base_ibfk_2` FOREIGN KEY (`id_sucursal`) REFERENCES `sucursal` (`id_sucursal`),
  ADD CONSTRAINT `agenda_base_ibfk_4` FOREIGN KEY (`id_estado_agenda`) REFERENCES `estado_agenda` (`id_estado_agenda`),
  ADD CONSTRAINT `agenda_base_ibfk_5` FOREIGN KEY (`id_clasificacion`) REFERENCES `clasificacion_consulta` (`id_clasificacion`),
  ADD CONSTRAINT `agenda_base_ibfk_6` FOREIGN KEY (`matricula`) REFERENCES `especialidades_profesional` (`matricula`);

--
-- Constraints for table `dias_agendas`
--
ALTER TABLE `dias_agendas`
  ADD CONSTRAINT `dias_agendas_ibfk_1` FOREIGN KEY (`id_agenda_base`) REFERENCES `agenda_base` (`id_agenda_base`),
  ADD CONSTRAINT `dias_agendas_ibfk_2` FOREIGN KEY (`id_dia`) REFERENCES `dias` (`id_dia`);

--
-- Constraints for table `dias_no_disponibles`
--
ALTER TABLE `dias_no_disponibles`
  ADD CONSTRAINT `dias_no_disponibles_ibfk_1` FOREIGN KEY (`id_agenda_base`) REFERENCES `agenda_base` (`id_agenda_base`);

--
-- Constraints for table `especialidades_profesional`
--
ALTER TABLE `especialidades_profesional`
  ADD CONSTRAINT `especialidades_profesional_ibfk_1` FOREIGN KEY (`id_profesional`) REFERENCES `profesionales` (`id_profesional`),
  ADD CONSTRAINT `especialidades_profesional_ibfk_2` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades` (`id_especialidad`);

--
-- Constraints for table `lista_espera`
--
ALTER TABLE `lista_espera`
  ADD CONSTRAINT `lista_espera_ibfk_1` FOREIGN KEY (`id_turno`) REFERENCES `turnos` (`id_turno`);

--
-- Constraints for table `obra_social_paciente`
--
ALTER TABLE `obra_social_paciente`
  ADD CONSTRAINT `obra_social_paciente_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`),
  ADD CONSTRAINT `obra_social_paciente_ibfk_2` FOREIGN KEY (`id_obra_social`) REFERENCES `obra_social` (`id_obra_social`);

--
-- Constraints for table `pacientes`
--
ALTER TABLE `pacientes`
  ADD CONSTRAINT `pacientes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Constraints for table `profesionales`
--
ALTER TABLE `profesionales`
  ADD CONSTRAINT `profesionales_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Constraints for table `secre`
--
ALTER TABLE `secre`
  ADD CONSTRAINT `secre_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Constraints for table `turnos`
--
ALTER TABLE `turnos`
  ADD CONSTRAINT `turnos_ibfk_1` FOREIGN KEY (`id_agenda_base`) REFERENCES `agenda_base` (`id_agenda_base`),
  ADD CONSTRAINT `turnos_ibfk_2` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`),
  ADD CONSTRAINT `turnos_ibfk_5` FOREIGN KEY (`id_estado_turno`) REFERENCES `estados_turno` (`id_estado_turno`);

--
-- Constraints for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);
--
-- Database: `hr_db`
--
CREATE DATABASE IF NOT EXISTS `hr_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `hr_db`;

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `country_id` char(2) NOT NULL,
  `country_name` varchar(40) DEFAULT NULL,
  `region_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`country_id`, `country_name`, `region_id`) VALUES
('AR', 'Argentina', 2),
('AU', 'Australia', 3),
('BE', 'Belgium', 1),
('BR', 'Brazil', 2),
('CA', 'Canada', 2),
('CH', 'Switzerland', 1),
('CN', 'China', 3),
('DE', 'Germany', 1),
('DK', 'Denmark', 1),
('EG', 'Egypt', 4),
('FR', 'France', 1),
('HK', 'HongKong', 3),
('IL', 'Israel', 4),
('IN', 'India', 3),
('IT', 'Italy', 1),
('JP', 'Japan', 3),
('KW', 'Kuwait', 4),
('MX', 'Mexico', 2),
('NG', 'Nigeria', 4),
('NL', 'Netherlands', 1),
('SG', 'Singapore', 3),
('UK', 'United Kingdom', 1),
('US', 'United States of America', 2),
('ZM', 'Zambia', 4),
('ZW', 'Zimbabwe', 4);

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `department_id` int NOT NULL,
  `department_name` varchar(30) NOT NULL,
  `manager_id` int DEFAULT NULL,
  `location_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`department_id`, `department_name`, `manager_id`, `location_id`) VALUES
(10, 'Administration', 200, 1700),
(20, 'Marketing', 201, 1800),
(30, 'Purchasing', 114, 1700),
(40, 'Human Resources', 203, 2400),
(50, 'Shipping', 121, 1500),
(60, 'IT', 103, 1400),
(70, 'Public Relations', 204, 2700),
(80, 'Sales', 145, 2500),
(90, 'Executive', 100, 1700),
(100, 'Finance', 108, 1700),
(110, 'Accounting', 205, 1700),
(120, 'Treasury', NULL, 1700),
(130, 'Corporate Tax', NULL, 1700),
(140, 'Control And Credit', NULL, 1700),
(150, 'Shareholder Services', NULL, 1700),
(160, 'Benefits', NULL, 1700),
(170, 'Manufacturing', NULL, 1700),
(180, 'Construction', NULL, 1700),
(190, 'Contracting', NULL, 1700),
(200, 'Operations', NULL, 1700),
(210, 'IT Support', NULL, 1700),
(220, 'NOC', NULL, 1700),
(230, 'IT Helpdesk', NULL, 1700),
(240, 'Government Sales', NULL, 1700),
(250, 'Retail Sales', NULL, 1700),
(260, 'Recruiting', NULL, 1700),
(270, 'Payroll', NULL, 1700),
(280, 'ulp ventas', NULL, 2200),
(290, 'ulp ventas2', NULL, 1700),
(300, 'pru08072010', NULL, 1700),
(310, 'ulp 08072010', NULL, 3200);

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `employee_id` int NOT NULL,
  `first_name` varchar(20) DEFAULT NULL,
  `last_name` varchar(25) NOT NULL,
  `email` varchar(25) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `hire_date` date NOT NULL,
  `job_id` varchar(10) NOT NULL,
  `salary` double DEFAULT NULL,
  `commission_pct` double DEFAULT NULL,
  `manager_id` int DEFAULT NULL,
  `department_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`employee_id`, `first_name`, `last_name`, `email`, `phone_number`, `hire_date`, `job_id`, `salary`, `commission_pct`, `manager_id`, `department_id`) VALUES
(100, 'Steven', 'King', 'SKINGbbbbbb', '515.123.4567', '2010-11-22', 'AD_PRES', 24000, NULL, NULL, 90),
(101, 'Neena', 'Kochhar', 'NKOCHHAR', '515.123.4568', '1989-09-07', 'AD_VP', 17000, NULL, 100, 90),
(102, 'Lex', 'De Haan', 'LDEHAAN', '515.123.4569', '1993-01-13', 'AD_VP', 17000, NULL, 100, 90),
(103, 'Alexander', 'Hunold', 'AHUNOLD', '590.423.4567', '1990-01-03', 'IT_PROG', 9000, NULL, 102, 60),
(104, 'Bruce', 'Ernst', 'BERNST', '590.423.4568', '1991-05-21', 'IT_PROG', 6000, NULL, 103, 60),
(105, 'David', 'Austin', 'DAUSTIN', '590.423.4569', '1997-06-25', 'IT_PROG', 4800, NULL, 103, 60),
(106, 'Valli', 'Pataballa', 'VPATABAL', '590.423.4560', '1998-02-05', 'IT_PROG', 4800, NULL, 103, 60),
(107, 'Diana', 'Lorentz', 'DLORENTZ', '590.423.5567', '1999-02-07', 'IT_PROG', 4200, NULL, 103, 60),
(108, 'Nancy', 'Greenberg', 'NGREENBE', '515.124.4569', '1994-08-17', 'FI_MGR', 12000, NULL, 101, 100),
(109, 'Daniel', 'Faviet', 'DFAVIET', '515.124.4169', '1994-08-16', 'FI_ACCOUNT', 9000, NULL, 108, 100),
(110, 'John', 'Chen', 'JCHEN', '515.124.4269', '1997-09-28', 'FI_ACCOUNT', 8200, NULL, 108, 100),
(111, 'Ismael', 'Sciarra', 'ISCIARRA', '515.124.4369', '1997-09-30', 'FI_ACCOUNT', 7700, NULL, 108, 100),
(112, 'Jose Manuel', 'Urman', 'JMURMAN', '515.124.4469', '1998-03-07', 'FI_ACCOUNT', 7800, NULL, 108, 100),
(113, 'Luis', 'Popp', 'LPOPP', '515.124.4567', '1999-12-07', 'FI_ACCOUNT', 6900, NULL, 108, 100),
(114, 'Den', 'Raphaely', 'DRAPHEAL', '515.127.4561', '1994-12-07', 'PU_MAN', 11000, NULL, 100, 30),
(115, 'Alexander', 'Khoo', 'AKHOO', '515.127.4562', '1995-05-18', 'PU_CLERK', 3100, NULL, 114, 30),
(116, 'Shelli', 'Baida', 'SBAIDA', '515.127.4563', '1997-12-24', 'PU_CLERK', 2900, NULL, 114, 30),
(117, 'Sigal', 'Tobias', 'STOBIAS', '515.127.4564', '1997-07-24', 'PU_CLERK', 2800, NULL, 114, 30),
(118, 'Guy', 'Himuro', 'GHIMURO', '515.127.4565', '1998-11-15', 'PU_CLERK', 2600, NULL, 114, 30),
(119, 'Karen', 'Colmenares', 'KCOLMENA', '515.127.4566', '1999-08-10', 'PU_CLERK', 2500, NULL, 114, 30),
(120, 'Matthew', 'Weiss', 'MWEISS', '650.123.1234', '1996-07-18', 'ST_MAN', 8000, NULL, 100, 50),
(121, 'Adam', 'Fripp', 'AFRIPP', '650.123.2234', '1997-04-10', 'ST_MAN', 8200, NULL, 100, 50),
(122, 'Payam', 'Kaufling', 'PKAUFLIN', '650.123.3234', '1995-05-01', 'ST_MAN', 7900, NULL, 100, 50),
(123, 'Shanta', 'Vollman', 'SVOLLMAN', '650.123.4234', '1997-10-10', 'ST_MAN', 6500, NULL, 100, 50),
(124, 'Kevin', 'Mourgos', 'KMOURGOS', '650.123.5234', '1999-11-16', 'ST_MAN', 5800, NULL, 100, 50),
(125, 'Julia', 'Nayer', 'JNAYER', '650.124.1214', '1997-07-16', 'ST_CLERK', 3200, NULL, 120, 50),
(126, 'Irene', 'Mikkilineni', 'IMIKKILI', '650.124.1224', '1998-09-28', 'ST_CLERK', 2700, NULL, 120, 50),
(127, 'James', 'Landry', 'JLANDRY', '650.124.1334', '1999-01-14', 'ST_CLERK', 2400, NULL, 120, 50),
(128, 'Steven', 'Markle', 'SMARKLE', '650.124.1434', '2000-03-08', 'ST_CLERK', 2200, NULL, 120, 50),
(129, 'Laura', 'Bissot', 'LBISSOT', '650.124.5234', '1997-08-20', 'ST_CLERK', 3300, NULL, 121, 50),
(130, 'Mozhe', 'Atkinson', 'MATKINSO', '650.124.6234', '1997-10-30', 'ST_CLERK', 2800, NULL, 121, 50),
(131, 'James', 'Marlow', 'JAMRLOW', '650.124.7234', '1997-02-16', 'ST_CLERK', 2500, NULL, 121, 50),
(132, 'TJ', 'Olson', 'TJOLSON', '650.124.8234', '1999-04-10', 'ST_CLERK', 2100, NULL, 121, 50),
(133, 'Jason', 'Mallin', 'JMALLIN', '650.127.1934', '1996-06-14', 'ST_CLERK', 3300, NULL, 122, 50),
(134, 'Michael', 'Rogers', 'MROGERS', '650.127.1834', '1998-08-26', 'ST_CLERK', 2900, NULL, 122, 50),
(135, 'Ki', 'Gee', 'KGEE', '650.127.1734', '1999-12-12', 'ST_CLERK', 2400, NULL, 122, 50),
(136, 'Hazel', 'Philtanker', 'HPHILTAN', '650.127.1634', '2000-02-06', 'ST_CLERK', 2200, NULL, 122, 50),
(137, 'Renske', 'Ladwig', 'RLADWIG', '650.121.1234', '1995-07-14', 'ST_CLERK', 3600, NULL, 123, 50),
(138, 'Stephen', 'Stiles', 'SSTILES', '650.121.2034', '1997-10-26', 'ST_CLERK', 3200, NULL, 123, 50),
(139, 'John', 'Seo', 'JSEO', '650.121.2019', '1998-02-12', 'ST_CLERK', 2700, NULL, 123, 50),
(140, 'Joshua', 'Patel', 'JPATEL', '650.121.1834', '1998-04-06', 'ST_CLERK', 2500, NULL, 123, 50),
(141, 'Trenna', 'Rajs', 'TRAJS', '650.121.8009', '1995-10-17', 'ST_CLERK', 3500, NULL, 124, 50),
(142, 'Curtis', 'Davies', 'CDAVIES', '650.121.2994', '1997-01-29', 'ST_CLERK', 3100, NULL, 124, 50),
(143, 'Randall', 'Matos', 'RMATOS', '650.121.2874', '1998-03-15', 'ST_CLERK', 2600, NULL, 124, 50),
(144, 'Peter', 'Vargas', 'PVARGAS', '650.121.2004', '1998-07-09', 'ST_CLERK', 2500, NULL, 124, 50),
(145, 'John', 'Russell', 'JRUSSEL', '011.44.1344.429268', '1996-10-01', 'SA_MAN', 14000, 0.4, 100, 80),
(146, 'Karen', 'Partners', 'KPARTNER', '011.44.1344.467268', '1997-01-05', 'SA_MAN', 13500, 0.3, 100, 80),
(147, 'Alberto', 'Errazuriz', 'AERRAZUR', '011.44.1344.429278', '1997-03-10', 'SA_MAN', 12000, 0.3, 100, 80),
(148, 'Gerald', 'Cambrault', 'GCAMBRAU', '011.44.1344.619268', '1999-10-15', 'SA_MAN', 11000, 0.3, 100, 80),
(149, 'Eleni', 'Zlotkey', 'EZLOTKEY', '011.44.1344.429018', '2000-01-29', 'SA_MAN', 10500, 0.2, 100, 80),
(150, 'Peter', 'Tucker', 'PTUCKER', '011.44.1344.129268', '1997-01-30', 'SA_REP', 10000, 0.3, 145, 80),
(151, 'David', 'Bernstein', 'DBERNSTE', '011.44.1344.345268', '1997-03-24', 'SA_REP', 9500, 0.25, 145, 80),
(152, 'Peter', 'Hall', 'PHALL', '011.44.1344.478968', '1997-08-20', 'SA_REP', 9000, 0.25, 145, 80),
(153, 'Christopher', 'Olsen', 'COLSEN', '011.44.1344.498718', '1998-03-30', 'SA_REP', 8000, 0.2, 145, 80),
(154, 'Nanette', 'Cambrault', 'NCAMBRAU', '011.44.1344.987668', '1998-12-09', 'SA_REP', 7500, 0.2, 145, 80),
(155, 'Oliver', 'Tuvault', 'OTUVAULT', '011.44.1344.486508', '1999-11-23', 'SA_REP', 7000, 0.15, 145, 80),
(156, 'Janette', 'King', 'JKING', '011.44.1345.429268', '1996-01-30', 'SA_REP', 10000, 0.35, 146, 80),
(157, 'Patrick', 'Sully', 'PSULLY', '011.44.1345.929268', '1996-03-04', 'SA_REP', 9500, 0.35, 146, 80),
(158, 'Allan', 'McEwen', 'AMCEWEN', '011.44.1345.829268', '1996-08-01', 'SA_REP', 9000, 0.35, 146, 80),
(159, 'Lindsey', 'Smith', 'LSMITH', '011.44.1345.729268', '1997-03-10', 'SA_REP', 8000, 0.3, 146, 80),
(160, 'Louise', 'Doran', 'LDORAN', '011.44.1345.629268', '1997-12-15', 'SA_REP', 7500, 0.3, 146, 80),
(161, 'Sarath', 'Sewall', 'SSEWALL', '011.44.1345.529268', '1998-11-03', 'SA_REP', 7000, 0.25, 146, 80),
(162, 'Clara', 'Vishney', 'CVISHNEY', '011.44.1346.129268', '1997-11-11', 'SA_REP', 10500, 0.25, 147, 80),
(163, 'Danielle', 'Greene', 'DGREENE', '011.44.1346.229268', '1999-03-19', 'SA_REP', 9500, 0.15, 147, 80),
(164, 'Mattea', 'Marvins', 'MMARVINS', '011.44.1346.329268', '2000-01-24', 'SA_REP', 7200, 0.1, 147, 80),
(165, 'David', 'Lee', 'DLEE', '011.44.1346.529268', '2000-02-23', 'SA_REP', 6800, 0.1, 147, 80),
(166, 'Sundar', 'Ande', 'SANDE', '011.44.1346.629268', '2000-03-24', 'SA_REP', 6400, 0.1, 147, 80),
(167, 'Amit', 'Banda', 'ABANDA', '011.44.1346.729268', '2000-04-21', 'SA_REP', 6200, 0.1, 147, 80),
(168, 'Lisa', 'Ozer', 'LOZER', '011.44.1343.929268', '1997-03-11', 'SA_REP', 11500, 0.25, 148, 80),
(169, 'Harrison', 'Bloom', 'HBLOOM', '011.44.1343.829268', '1998-03-23', 'SA_REP', 10000, 0.2, 148, 80),
(170, 'Tayler', 'Fox', 'TFOX', '011.44.1343.729268', '1998-01-24', 'SA_REP', 9600, 0.2, 148, 80),
(171, 'William', 'Smith', 'WSMITH', '011.44.1343.629268', '1999-02-23', 'SA_REP', 7400, 0.15, 148, 80),
(172, 'Elizabeth', 'Bates', 'EBATES', '011.44.1343.529268', '1999-03-24', 'SA_REP', 7300, 0.15, 148, 80),
(173, 'Sundita', 'Kumar', 'SKUMAR', '011.44.1343.329268', '2000-04-21', 'SA_REP', 6100, 0.1, 148, 80),
(174, 'Ellen', 'Abel', 'EABEL', '011.44.1644.429267', '1996-05-11', 'SA_REP', 11000, 0.3, 149, 80),
(175, 'Alyssa', 'Hutton', 'AHUTTON', '011.44.1644.429266', '1997-03-19', 'SA_REP', 8800, 0.25, 149, 80),
(176, 'Jonathon', 'Taylor', 'JTAYLOR', '011.44.1644.429265', '1998-03-24', 'SA_REP', 8600, 0.2, 149, 80),
(177, 'Jack', 'Livingston', 'JLIVINGS', '011.44.1644.429264', '1998-04-23', 'SA_REP', 8400, 0.2, 149, 80),
(178, 'Kimberely', 'Grant', 'KGRANT', '011.44.1644.429263', '1999-05-24', 'SA_REP', 7000, 0.15, 149, NULL),
(179, 'Charles', 'Johnson', 'CJOHNSON', '011.44.1644.429262', '2000-01-04', 'SA_REP', 6200, 0.1, 149, 80),
(180, 'Winston', 'Taylor', 'WTAYLOR', '650.507.9876', '1998-01-24', 'SH_CLERK', 3200, NULL, 120, 50),
(181, 'Jean', 'Fleaur', 'JFLEAUR', '650.507.9877', '1998-02-23', 'SH_CLERK', 3100, NULL, 120, 50),
(182, 'Martha', 'Sullivan', 'MSULLIVA', '650.507.9878', '1999-06-21', 'SH_CLERK', 2500, NULL, 120, 50),
(183, 'Girard', 'Geoni', 'GGEONI', '650.507.9879', '2000-02-03', 'SH_CLERK', 2800, NULL, 120, 50),
(184, 'Nandita', 'Sarchand', 'NSARCHAN', '650.509.1876', '1996-01-27', 'SH_CLERK', 4200, NULL, 121, 50),
(185, 'Alexis', 'Bull', 'ABULL', '650.509.2876', '1997-02-20', 'SH_CLERK', 4100, NULL, 121, 50),
(186, 'Julia', 'Dellinger', 'JDELLING', '650.509.3876', '1998-06-24', 'SH_CLERK', 3400, NULL, 121, 50),
(187, 'Anthony', 'Cabrio', 'ACABRIO', '650.509.4876', '1999-02-07', 'SH_CLERK', 3000, NULL, 121, 50),
(188, 'Kelly', 'Chung', 'KCHUNG', '650.505.1876', '1997-06-14', 'SH_CLERK', 3800, NULL, 122, 50),
(189, 'Jennifer', 'Dilly', 'JDILLY', '650.505.2876', '1997-08-13', 'SH_CLERK', 3600, NULL, 122, 50),
(190, 'Timothy', 'Gates', 'TGATES', '650.505.3876', '1998-07-11', 'SH_CLERK', 2900, NULL, 122, 50),
(191, 'Randall', 'Perkins', 'RPERKINS', '650.505.4876', '1999-12-19', 'SH_CLERK', 2500, NULL, 122, 50),
(192, 'Sarah', 'Bell', 'SBELL', '650.501.1876', '1996-02-04', 'SH_CLERK', 4000, NULL, 123, 50),
(193, 'Britney', 'Everett', 'BEVERETT', '650.501.2876', '1997-03-03', 'SH_CLERK', 3900, NULL, 123, 50),
(194, 'Samuel', 'McCain', 'SMCCAIN', '650.501.3876', '1998-07-01', 'SH_CLERK', 3200, NULL, 123, 50),
(195, 'Vance', 'Jones', 'VJONES', '650.501.4876', '1999-03-17', 'SH_CLERK', 2800, NULL, 123, 50),
(196, 'Alana', 'Walsh', 'AWALSH', '650.507.9811', '1998-04-24', 'SH_CLERK', 3100, NULL, 124, 50),
(197, 'Kevin', 'Feeney', 'KFEENEY', '650.507.9822', '1998-05-23', 'SH_CLERK', 3000, NULL, 124, 50),
(198, 'Donald', 'OConnell', 'DOCONNEL', '650.507.9833', '1999-06-21', 'SH_CLERK', 2600, NULL, 124, 50),
(199, 'Douglas', 'Grant', 'DGRANT', '650.507.9844', '2000-01-13', 'SH_CLERK', 2600, NULL, 124, 50),
(200, 'Jennifer', 'Whalen', 'JWHALEN', '515.123.4444', '1987-09-17', 'AD_ASST', 4400, NULL, 101, 10),
(201, 'Michael', 'Hartstein', 'MHARTSTE', '515.123.5555', '1996-02-17', 'MK_MAN', 13000, NULL, 100, 20),
(202, 'Pat', 'Fay', 'PFAY', '603.123.6666', '1997-08-17', 'MK_REP', 6000, NULL, 201, 20),
(203, 'Susan', 'Mavris', 'SMAVRIS', '515.123.7777', '1994-06-07', 'HR_REP', 6500, NULL, 101, 40),
(204, 'Hermann', 'Baer', 'HBAER', '515.123.8888', '1994-06-07', 'PR_REP', 10000, NULL, 101, 70),
(205, 'Shelley', 'Higgins', 'SHIGGINS', '515.123.8080', '1994-06-07', 'AC_MGR', 12000, NULL, 101, 110),
(206, 'William', 'Gietz', 'WGIETZ', '515.123.8181', '1994-06-07', 'AC_ACCOUNT', 8300, NULL, 205, 110);

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `job_id` varchar(10) NOT NULL,
  `job_title` varchar(35) NOT NULL,
  `min_salary` int DEFAULT NULL,
  `max_salary` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`job_id`, `job_title`, `min_salary`, `max_salary`) VALUES
('AC_ACCOUNT', 'Public Accountant', 4200, 9000),
('AC_MGR', 'Accounting Manager', 8200, 16000),
('AD_ASST', 'Administration Assistant', 3000, 6000),
('AD_PRES', 'President', 20000, 40000),
('AD_VP', 'Administration Vice President', 15000, 30000),
('FI_ACCOUNT', 'Accountant', 4200, 9000),
('FI_MGR', 'Finance Manager', 8200, 16000),
('HR_REP', 'Human Resources Representative', 4000, 9000),
('IT_PROG', 'Programmer', 4000, 10000),
('MK_MAN', 'Marketing Manager', 9000, 15000),
('MK_REP', 'Marketing Representative', 4000, 9000),
('PR_REP', 'Public Relations Representative', 4500, 10500),
('PU_CLERK', 'Purchasing Clerk', 2500, 5500),
('PU_MAN', 'Purchasing Manager', 8000, 15000),
('SA_MAN', 'Sales Manager', 10000, 20000),
('SA_REP', 'Sales Representative', 6000, 12000),
('SH_CLERK', 'Shipping Clerk', 2500, 5500),
('ST_CLERK', 'Stock Clerk', 2000, 5000),
('ST_MAN', 'Stock Manager', 5500, 8500);

-- --------------------------------------------------------

--
-- Table structure for table `job_history`
--

CREATE TABLE `job_history` (
  `employee_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `job_id` varchar(10) NOT NULL,
  `department_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `job_history`
--

INSERT INTO `job_history` (`employee_id`, `start_date`, `end_date`, `job_id`, `department_id`) VALUES
(101, '1989-09-21', '1993-10-27', 'AC_ACCOUNT', 110),
(101, '1993-10-28', '1997-03-15', 'AC_MGR', 110),
(102, '1993-01-13', '1998-07-24', 'IT_PROG', 60),
(114, '1998-03-24', '1999-12-31', 'ST_CLERK', 50),
(122, '1999-01-01', '1999-12-31', 'ST_CLERK', 50),
(176, '1998-03-24', '1998-12-31', 'SA_REP', 80),
(176, '1999-01-01', '1999-12-31', 'SA_MAN', 80),
(200, '1987-09-17', '1993-06-17', 'AD_ASST', 90),
(200, '1994-07-01', '1998-12-31', 'AC_ACCOUNT', 90),
(201, '1996-02-17', '1999-12-19', 'MK_REP', 20);

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `location_id` int NOT NULL,
  `street_address` varchar(40) DEFAULT NULL,
  `postal_code` varchar(12) DEFAULT NULL,
  `city` varchar(30) NOT NULL,
  `state_province` varchar(25) DEFAULT NULL,
  `country_id` char(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`location_id`, `street_address`, `postal_code`, `city`, `state_province`, `country_id`) VALUES
(1000, '1297 Via Cola di Rie', '00989', 'Roma', NULL, 'IT'),
(1100, '93091 Calle della Testa', '10934', 'Venice', NULL, 'IT'),
(1200, '2017 Shinjuku-ku', '1689', 'Tokyo', 'Tokyo Prefecture', 'JP'),
(1300, '9450 Kamiya-cho', '6823', 'Hiroshima', NULL, 'JP'),
(1400, '2014 Jabberwocky Rd', '26192', 'Southlake', 'Texas', 'US'),
(1500, '2011 Interiors Blvd', '99236', 'South San Francisco', 'California', 'US'),
(1600, '2007 Zagora St', '50090', 'South Brunswick', 'New Jersey', 'US'),
(1700, '2004 Charade Rd', '98199', 'Seattle', 'Washington', 'US'),
(1800, '147 Spadina Ave', 'M5V 2L7', 'Toronto', 'Ontario', 'CA'),
(1900, '6092 Boxwood St', 'YSW 9T2', 'Whitehorse', 'Yukon', 'CA'),
(2000, '40-5-12 Laogianggen', '190518', 'Beijing', NULL, 'CN'),
(2100, '1298 Vileparle (E)', '490231', 'Bombay', 'Maharashtra', 'IN'),
(2200, '12-98 Victoria Street', '2901', 'Sydney', 'New South Wales', 'AU'),
(2300, '198 Clementi North', '540198', 'Singapore', NULL, 'SG'),
(2400, '8204 Arthur St', NULL, 'London', NULL, 'UK'),
(2500, 'Magdalen Centre, The Oxford Science Park', 'OX9 9ZB', 'Oxford', 'Oxford', 'UK'),
(2600, '9702 Chester Road', '09629850293', 'Stretford', 'Manchester', 'UK'),
(2700, 'Schwanthalerstr. 7031', '80925', 'Munich', 'Bavaria', 'DE'),
(2800, 'Rua Frei Caneca 1360 ', '01307-002', 'Sao Paulo', 'Sao Paulo', 'BR'),
(2900, '20 Rue des Corps-Saints', '1730', 'Geneva', 'Geneve', 'CH'),
(3000, 'Murtenstrasse 921', '3095', 'Bern', 'BE', 'CH'),
(3100, 'Pieter Breughelstraat 837', '3029SK', 'Utrecht', 'Utrecht', 'NL'),
(3200, 'Mariano Escobedo 9991', '11932', 'Mexico City', 'Distrito Federal,', 'MX');

-- --------------------------------------------------------

--
-- Table structure for table `regions`
--

CREATE TABLE `regions` (
  `region_id` int NOT NULL,
  `region_name` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `regions`
--

INSERT INTO `regions` (`region_id`, `region_name`) VALUES
(1, 'Europe'),
(2, 'Americas'),
(3, 'Asia'),
(4, 'Middle East and Africa');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`country_id`),
  ADD KEY `countr_reg_fk` (`region_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`department_id`),
  ADD KEY `dept_location_ix` (`location_id`),
  ADD KEY `dept_mgr_fk` (`manager_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`employee_id`),
  ADD UNIQUE KEY `emp_email_uk` (`email`),
  ADD KEY `emp_department_ix` (`department_id`),
  ADD KEY `emp_job_ix` (`job_id`),
  ADD KEY `emp_manager_ix` (`manager_id`),
  ADD KEY `emp_name_ix` (`last_name`,`first_name`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`job_id`);

--
-- Indexes for table `job_history`
--
ALTER TABLE `job_history`
  ADD PRIMARY KEY (`employee_id`,`start_date`),
  ADD KEY `jhist_job_ix` (`job_id`),
  ADD KEY `jhist_employee_ix` (`employee_id`),
  ADD KEY `jhist_department_ix` (`department_id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`location_id`),
  ADD KEY `loc_city_ix` (`city`),
  ADD KEY `loc_state_province_ix` (`state_province`),
  ADD KEY `loc_country_ix` (`country_id`);

--
-- Indexes for table `regions`
--
ALTER TABLE `regions`
  ADD PRIMARY KEY (`region_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `countries`
--
ALTER TABLE `countries`
  ADD CONSTRAINT `countr_reg_fk` FOREIGN KEY (`region_id`) REFERENCES `regions` (`region_id`);

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `dept_loc_fk` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`),
  ADD CONSTRAINT `dept_mgr_fk` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `emp_dept_fk` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`),
  ADD CONSTRAINT `emp_job_fk` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`),
  ADD CONSTRAINT `emp_manager_fk` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `job_history`
--
ALTER TABLE `job_history`
  ADD CONSTRAINT `jhist_dept_fk` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`),
  ADD CONSTRAINT `jhist_emp_fk` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`),
  ADD CONSTRAINT `jhist_job_fk` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`);

--
-- Constraints for table `locations`
--
ALTER TABLE `locations`
  ADD CONSTRAINT `loc_c_id_fk` FOREIGN KEY (`country_id`) REFERENCES `countries` (`country_id`);
--
-- Database: `testdb`
--
CREATE DATABASE IF NOT EXISTS `testdb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `testdb`;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationality` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `username`, `password_hash`, `name`, `nationality`, `phone`) VALUES
('c69b8b77-7dc4-11ef-9068-0250b2c02df2', 'pepito@mail.com', 'xX_p3p1t0_Xx', '1234', 'Pedro Gonzales', 'Argentina', '1-234-567'),
('c69b9d8a-7dc4-11ef-9068-0250b2c02df2', 'ggg@gmail.com', 'gg:)', 'a$$_lick3r', 'Helto Canenas', 'Perú', '3-666-999'),
('c69ba5c2-7dc4-11ef-9068-0250b2c02df2', 'milei@yahoo.com.ar', 'Mata Zurdos', 'Leon_mieloso', 'Javier Mielei', 'Cielo', '0-000-000');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);
--
-- Database: `tp5`
--
CREATE DATABASE IF NOT EXISTS `tp5` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `tp5`;

-- --------------------------------------------------------

--
-- Table structure for table `clientes`
--

CREATE TABLE `clientes` (
  `nro` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `ciudad` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` tinyint NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clientes`
--

INSERT INTO `clientes` (`nro`, `nombre`, `ciudad`, `estado`) VALUES
(1, 'Cliente Test', 'Córdoba', 1);

-- --------------------------------------------------------

--
-- Table structure for table `error`
--

CREATE TABLE `error` (
  `error_id` int NOT NULL,
  `código` varchar(2000) COLLATE utf8mb4_general_ci NOT NULL,
  `mensaje` varchar(2000) COLLATE utf8mb4_general_ci NOT NULL,
  `programa` varchar(2000) COLLATE utf8mb4_general_ci NOT NULL,
  `fecha` datetime NOT NULL,
  `usuario` varchar(2000) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `error`
--

INSERT INTO `error` (`error_id`, `código`, `mensaje`, `programa`, `fecha`, `usuario`) VALUES
(1, 'MYSQL_ERRNO ERR106', 'MSGError al intentar eliminar el item', 'sp_eliminar_item', '2024-11-06 17:02:27', 'root@localhost'),
(2, 'MYSQL_ERRNO ERR106', 'MSGError al intentar eliminar el item', 'sp_eliminar_item', '2024-11-06 17:04:07', 'root@localhost'),
(3, 'MYSQL_ERRNO ERR206', 'MSGError al intentar eliminar el cliente', 'sp_eliminar_cliente', '2024-11-06 17:14:17', 'root@localhost'),
(4, 'MYSQL_ERRNO ERR303', 'MSGNo existe un cliente activo con el número: 1', 'sp_agregar_pedido', '2024-11-06 18:04:55', 'root@localhost'),
(5, 'MYSQL_ERRNO ERR301', 'MSGError al intentar agregar el pedido', 'sp_agregar_pedido', '2024-11-06 18:04:55', 'root@localhost'),
(6, 'MYSQL_ERRNO ERR304', 'MSGNo existe un item activo con el número: 1', 'sp_agregar_pedido', '2024-11-06 18:05:10', 'root@localhost'),
(7, 'MYSQL_ERRNO ERR301', 'MSGError al intentar agregar el pedido', 'sp_agregar_pedido', '2024-11-06 18:05:10', 'root@localhost'),
(8, 'MYSQL_ERRNO ERR303', 'MSGNo existe un cliente activo con el número: 1', 'sp_agregar_pedido', '2024-11-06 18:05:19', 'root@localhost'),
(9, 'MYSQL_ERRNO ERR301', 'MSGError al intentar agregar el pedido', 'sp_agregar_pedido', '2024-11-06 18:05:19', 'root@localhost'),
(10, 'MYSQL_ERRNO ERR303', 'MSGNo existe un cliente activo con el número: 1', 'sp_agregar_pedido', '2024-11-06 18:11:45', 'root@localhost'),
(11, 'MYSQL_ERRNO ERR301', 'MSGError al intentar agregar el pedido', 'sp_agregar_pedido', '2024-11-06 18:11:45', 'root@localhost'),
(12, 'MYSQL_ERRNO ERR304', 'MSGNo existe un item activo con el número: 1', 'sp_agregar_pedido', '2024-11-06 18:15:31', 'root@localhost'),
(13, 'MYSQL_ERRNO ERR301', 'MSGError al intentar agregar el pedido', 'sp_agregar_pedido', '2024-11-06 18:15:32', 'root@localhost'),
(14, 'MYSQL_ERRNO ERR304', 'MSGNo existe un item activo con el número: 1', 'sp_agregar_pedido', '2024-11-06 18:15:57', 'root@localhost'),
(15, 'MYSQL_ERRNO ERR301', 'MSGError al intentar agregar el pedido', 'sp_agregar_pedido', '2024-11-06 18:15:57', 'root@localhost'),
(16, 'MYSQL_ERRNO ERR303', 'MSGNo existe un cliente activo con el número: 1', 'sp_agregar_pedido', '2024-11-06 18:32:36', 'root@localhost'),
(17, 'MYSQL_ERRNO ERR301', 'MSGError al intentar agregar el pedido', 'sp_agregar_pedido', '2024-11-06 18:32:36', 'root@localhost');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `nro` int NOT NULL,
  `descripcion` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `ciudad` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` tinyint NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`nro`, `descripcion`, `ciudad`, `estado`) VALUES
(1, 'Laptop HP', 'Buenos Aires', 1),
(2, 'Mouse Logitech', 'Buenos Aires', 1);

-- --------------------------------------------------------

--
-- Table structure for table `pedidos`
--

CREATE TABLE `pedidos` (
  `nrop` int NOT NULL,
  `nroc` int NOT NULL,
  `nroi` int NOT NULL,
  `fecha` datetime NOT NULL,
  `cantidad` int NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `estado` tinyint NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pedidos`
--

INSERT INTO `pedidos` (`nrop`, `nroc`, `nroi`, `fecha`, `cantidad`, `precio`, `estado`) VALUES
(1, 1, 1, '2024-11-06 18:39:57', 2, '1500.00', 1),
(2, 1, 2, '2024-11-06 18:39:57', 1, '200.00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `proveedores`
--

CREATE TABLE `proveedores` (
  `nro` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `categoria` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ciudad` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` tinyint NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `proveedores`
--

INSERT INTO `proveedores` (`nro`, `nombre`, `categoria`, `ciudad`, `estado`) VALUES
(1, 'Proveedor Test', 'Tecnología', 'Buenos Aires', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`nro`);

--
-- Indexes for table `error`
--
ALTER TABLE `error`
  ADD PRIMARY KEY (`error_id`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`nro`);

--
-- Indexes for table `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`nrop`),
  ADD KEY `nroc` (`nroc`),
  ADD KEY `nroi` (`nroi`);

--
-- Indexes for table `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`nro`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `clientes`
--
ALTER TABLE `clientes`
  MODIFY `nro` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `error`
--
ALTER TABLE `error`
  MODIFY `error_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `nro` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `nrop` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `nro` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`nroc`) REFERENCES `clientes` (`nro`),
  ADD CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`nroi`) REFERENCES `items` (`nro`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
