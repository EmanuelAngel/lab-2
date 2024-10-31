-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 31-10-2024 a las 01:09:12
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `agenda_consultorio`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admins`
--

CREATE TABLE `admins` (
  `id_admin` int(11) NOT NULL,
  `estado` tinyint(4) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `admins`
--

INSERT INTO `admins` (`id_admin`, `estado`, `id_usuario`) VALUES
(1, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agenda_base`
--

CREATE TABLE `agenda_base` (
  `id_agenda_base` int(11) NOT NULL,
  `id_sucursal` int(11) NOT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1,
  `id_estado_agenda` int(11) NOT NULL DEFAULT 1,
  `id_clasificacion` int(11) NOT NULL,
  `duracion_turno` int(11) NOT NULL,
  `sobreturnos_maximos` int(11) NOT NULL,
  `matricula` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `agenda_base`
--

INSERT INTO `agenda_base` (`id_agenda_base`, `id_sucursal`, `estado`, `id_estado_agenda`, `id_clasificacion`, `duracion_turno`, `sobreturnos_maximos`, `matricula`) VALUES
(1, 1, 1, 2, 1, 0, 0, 'PROF1234');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clasificacion_consulta`
--

CREATE TABLE `clasificacion_consulta` (
  `id_clasificacion` int(11) NOT NULL,
  `nombre_clasificacion` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clasificacion_consulta`
--

INSERT INTO `clasificacion_consulta` (`id_clasificacion`, `nombre_clasificacion`, `descripcion`) VALUES
(1, 'Normal', 'Consulta médica general'),
(2, 'Especial', 'Clasificación para consultas especiales con mayor atención.'),
(3, 'VIP', 'Clasificación para pacientes VIP con atención preferencial.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dias`
--

CREATE TABLE `dias` (
  `id_dia` int(11) NOT NULL,
  `dia` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `dias`
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
-- Estructura de tabla para la tabla `dias_agendas`
--

CREATE TABLE `dias_agendas` (
  `id_dia` int(11) NOT NULL,
  `id_agenda_base` int(11) NOT NULL,
  `horario_inicio` time NOT NULL,
  `horario_fin` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dias_no_disponibles`
--

CREATE TABLE `dias_no_disponibles` (
  `id_dia_no_disponible` int(11) NOT NULL,
  `id_agenda_base` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `tipo_bloqueo` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `dias_no_disponibles`
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
-- Estructura de tabla para la tabla `especialidades`
--

CREATE TABLE `especialidades` (
  `id_especialidad` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `estado` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `especialidades`
--

INSERT INTO `especialidades` (`id_especialidad`, `nombre`, `estado`) VALUES
(1, 'Cardiología', 1),
(2, 'Medicina Clínica', 1),
(3, 'Generalista', 1),
(4, 'Dermatología', 1),
(5, 'Pediatría', 1),
(6, 'Oftalmología', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidades_profesional`
--

CREATE TABLE `especialidades_profesional` (
  `id_profesional` int(11) NOT NULL,
  `id_especialidad` int(11) NOT NULL,
  `matricula` varchar(25) NOT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `especialidades_profesional`
--

INSERT INTO `especialidades_profesional` (`id_profesional`, `id_especialidad`, `matricula`, `estado`) VALUES
(1, 1, 'PROF1234', 1),
(1, 2, 'PROF2345', 1),
(1, 3, 'PROF3456', 1),
(2, 2, 'PROF4567', 1),
(2, 5, 'PROF5678', 1),
(3, 1, 'CAR12345', 1),
(4, 2, 'SOSA67890', 1),
(5, 3, 'TORRES11223', 1),
(6, 4, 'PEREZ44556', 1),
(7, 5, 'BENITEZ77889', 1),
(8, 1, 'ALVAREZ99000', 1),
(9, 6, 'OGONZ123', 1),
(10, 6, 'OALVZ123', 1),
(11, 5, 'PGIRA123', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados_turno`
--

CREATE TABLE `estados_turno` (
  `id_estado_turno` int(11) NOT NULL,
  `nombre_estado` varchar(50) NOT NULL,
  `estado_activo` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estados_turno`
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
-- Estructura de tabla para la tabla `estado_agenda`
--

CREATE TABLE `estado_agenda` (
  `id_estado_agenda` int(11) NOT NULL,
  `nombre_estado` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_agenda`
--

INSERT INTO `estado_agenda` (`id_estado_agenda`, `nombre_estado`) VALUES
(1, 'Activa'),
(3, 'Bloqueada'),
(4, 'Finalizada'),
(2, 'Inactiva');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lista_espera`
--

CREATE TABLE `lista_espera` (
  `id_lista_espera` int(11) NOT NULL,
  `fecha_inscripcion` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_turno` int(11) NOT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `obra_social`
--

CREATE TABLE `obra_social` (
  `id_obra_social` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `obra_social`
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
-- Estructura de tabla para la tabla `obra_social_paciente`
--

CREATE TABLE `obra_social_paciente` (
  `id_paciente` int(11) NOT NULL,
  `id_obra_social` int(11) NOT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `estado` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `obra_social_paciente`
--

INSERT INTO `obra_social_paciente` (`id_paciente`, `id_obra_social`, `updatedAt`, `estado`) VALUES
(20, 2, '2024-10-27 15:28:11', 1),
(21, 1, '2024-10-27 15:45:03', 1),
(22, 3, '2024-10-27 15:45:03', 1),
(24, 1, '2024-10-27 21:08:19', 1),
(26, 1, '2024-10-27 21:08:19', 1),
(28, 1, '2024-10-27 21:08:19', 1),
(32, 1, '2024-10-27 21:08:19', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id_paciente` int(11) NOT NULL,
  `tiene_obra_social` tinyint(4) NOT NULL,
  `estado` tinyint(4) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fotocopia_dni` longblob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pacientes`
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
(33, 0, 1, 49, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesionales`
--

CREATE TABLE `profesionales` (
  `id_profesional` int(11) NOT NULL,
  `estado` tinyint(4) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesionales`
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
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`, `descripcion`) VALUES
(1, 'Admin', 'Administrador del sistema'),
(2, 'Secretario', 'Asistente administrativo'),
(3, 'Profesional', 'Médico profesional'),
(4, 'Paciente', 'Usuario del sistema como paciente'),
(6, 'probando funcionamiento parcial', 'probando 123456');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `secre`
--

CREATE TABLE `secre` (
  `id_secre` int(11) NOT NULL,
  `estado` tinyint(4) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_sucursal` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `secre`
--

INSERT INTO `secre` (`id_secre`, `estado`, `id_usuario`, `id_sucursal`) VALUES
(1, 1, 2, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sucursal`
--

CREATE TABLE `sucursal` (
  `id_sucursal` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sucursal`
--

INSERT INTO `sucursal` (`id_sucursal`, `nombre`, `direccion`, `telefono`, `email`, `estado`) VALUES
(1, 'Clínica San Luis', 'Calle probando 123, San Luis', '4454041', 'clinica_sanluis@gmail.com', 1),
(2, 'Sucursal Central prueba2', 'Av. Perón 123, San Luis, San Luis', '+549266456789', 'sucursalcentral@prueba.com', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos`
--

CREATE TABLE `turnos` (
  `id_turno` int(11) NOT NULL,
  `id_agenda_base` int(11) NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `id_estado_turno` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `horario_inicio` time NOT NULL,
  `horario_fin` time NOT NULL,
  `motivo_consulta` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `turnos`
--

INSERT INTO `turnos` (`id_turno`, `id_agenda_base`, `id_paciente`, `id_estado_turno`, `fecha`, `horario_inicio`, `horario_fin`, `motivo_consulta`) VALUES
(19, 1, 26, 1, '2024-10-19', '14:00:00', '15:00:00', 'Consulta de rutina'),
(20, 1, 28, 1, '2024-10-20', '15:00:00', '16:00:00', 'Revisión anual'),
(21, 1, 20, 1, '2024-10-21', '16:00:00', '17:00:00', 'Consulta de rutina'),
(22, 1, 24, 1, '2024-10-22', '16:00:00', '17:00:00', 'Revisión anual'),
(23, 1, 28, 1, '2024-10-23', '09:00:00', '10:00:00', 'Revisión anual'),
(24, 1, 32, 1, '2024-10-24', '16:00:00', '17:00:00', 'Control de seguimiento'),
(26, 1, 32, 1, '2024-10-26', '09:00:00', '10:00:00', 'Control de seguimiento'),
(27, 1, 5, 1, '2024-10-27', '14:00:00', '15:00:00', 'Consulta de rutina'),
(28, 1, 24, 1, '2024-10-28', '13:00:00', '14:00:00', 'Revisión anual'),
(29, 1, 20, 1, '2024-10-29', '12:00:00', '13:00:00', 'Consulta de rutina'),
(30, 1, 28, 1, '2024-10-30', '11:00:00', '12:00:00', 'Revisión anual'),
(31, 1, 21, 1, '2024-10-31', '10:00:00', '11:00:00', 'Consulta de rutina'),
(32, 1, 22, 1, '2024-11-01', '15:00:00', '16:00:00', 'Control de seguimiento'),
(35, 1, 22, 1, '2024-11-04', '14:00:00', '15:00:00', 'Consulta de rutina'),
(36, 1, 5, 1, '2024-11-05', '13:00:00', '14:00:00', 'Revisión anual'),
(37, 1, 26, 1, '2024-11-06', '12:00:00', '13:00:00', 'Control de seguimiento'),
(38, 1, 24, 1, '2024-11-07', '11:00:00', '12:00:00', 'Consulta de rutina'),
(39, 1, 32, 1, '2024-11-08', '08:00:00', '09:00:00', 'Control de seguimiento'),
(41, 1, 28, 1, '2024-11-10', '15:00:00', '16:00:00', 'Revisión anual'),
(42, 1, 24, 1, '2024-11-11', '08:00:00', '09:00:00', 'Consulta de rutina'),
(43, 1, 22, 1, '2024-11-12', '08:00:00', '09:00:00', 'Control de seguimiento'),
(44, 1, 21, 1, '2024-11-13', '11:00:00', '12:00:00', 'Revisión anual'),
(45, 1, 28, 1, '2024-11-14', '16:00:00', '17:00:00', 'Control de seguimiento'),
(46, 1, 32, 1, '2024-11-15', '13:00:00', '14:00:00', 'Control de seguimiento');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `nombre_usuario` varchar(100) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `dni` int(11) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `estado` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `id_rol`, `nombre_usuario`, `contraseña`, `nombre`, `apellido`, `dni`, `telefono`, `direccion`, `email`, `estado`) VALUES
(1, 1, 'admin_sanluis', 'password123', 'María', 'Pérez', 30123406, '2147483647', 'Calle Falsa 123, San Luis', 'mariaperez@gmail.com', 1),
(2, 2, 'sec_jimenez', 'pass456', 'Roberto', 'Jiménez', 32123456, '2147483647', 'Av. Libertador 456, San Luis', 'robertosecretario@gmail.com', 1),
(3, 3, 'dr_gonzalez', 'medico2024', 'Jorge', 'González', 33123456, '2147483647', 'Calle Salud 789, San Luis', 'doctorjorge@gmail.com', 1),
(4, 3, 'dra_morales', 'miPass2024', 'Ana', 'Morales', 34123456, '2147483647', 'Calle Bienestar 321, San Luis', 'anamorales@gmail.com', 1),
(5, 3, 'dr_fernandez', 'doc_f2024', 'Laura', 'Fernández', 35123456, '2147483647', 'Av. Medicina 654, San Luis', 'laurafernandez@gmail.com', 1),
(6, 4, 'Nico123', '1515202021', 'Nico', 'Alcaraz', 39091538, '2147483647', 'Av. Lafinur 123, San Luis, San Luis', 'perez@example.com', 1),
(37, 4, 'juanperez', 'password123', 'Juan', 'Perez', 30123456, '2147483647', 'Calle Falsa 123', 'juanperez@gmail.com', 1),
(38, 4, 'mariagarcia', 'password123', 'Maria', 'Garcia', 31123457, '2147483647', 'Av. Libertad 456', 'mariagarcia@hotmail.com', 1),
(39, 4, 'pedrorodriguez', 'password123', 'Pedro', 'Rodriguez', 32123458, '2147483647', 'Calle Mitre 789', 'pedrorodriguez@gmail.com', 1),
(40, 4, 'analopez', 'password123', 'Ana', 'Lopez', 33123459, '2147483647', 'Av. Roca 101', 'analopez@hotmail.com', 1),
(41, 4, 'lucasgonzalez', 'password123', 'Lucas', 'Gonzalez', 34123460, '2147483647', 'Calle Moreno 202', 'lucasgonzalez@gmail.com', 1),
(42, 4, 'sofiamartinez', 'password123', 'Sofia', 'Martinez', 35123461, '2147483647', 'Calle Belgrano 303', 'sofiamartinez@hotmail.com', 1),
(43, 4, 'manuelgomez', 'password123', 'Manuel', 'Gomez', 36123462, '2147483647', 'Av. España 404', 'manuelgomez@gmail.com', 1),
(44, 4, 'valentinasanchez', 'password123', 'Valentina', 'Sanchez', 37123463, '2147483647', 'Calle Rivadavia 505', 'valentinasanchez@hotmail.com', 1),
(45, 4, 'carloramos', 'password123', 'Carlo', 'Ramos', 38123464, '2147483647', 'Av. Pringles 606', 'carloramos@gmail.com', 1),
(46, 3, 'danielalvarez', 'password123', 'Daniel', 'Alvarez', 39123465, '2147483647', 'Calle Colon 707', 'danielalvarez@hotmail.com', 1),
(47, 4, 'martinfernandez', 'password123', 'Martin', 'Fernandez', 40123466, '2147483647', 'Calle Sarmiento 808', 'martinfernandez@gmail.com', 1),
(48, 4, 'giseladiaz', 'password123', 'Gisela', 'Diaz', 41123467, '2147483647', 'Av. Illia 909', 'giseladiaz@hotmail.com', 1),
(49, 4, 'robertoperez', 'password123', 'Roberto', 'Perez', 42123468, '2147483647', 'Calle Lavalle 1010', 'robertoperez@gmail.com', 1),
(50, 3, 'claragiraldo', 'password123', 'Clara', 'Giraldo', 43123469, '2147483647', 'Calle Saavedra 1111', 'claragiraldo@hotmail.com', 1),
(51, 4, 'franciscoruiz', 'password123', 'Francisco', 'Ruiz', 44123470, '2147483647', 'Av. Centenario 1212', 'franciscoruiz@gmail.com', 1),
(52, 3, 'dr_martinez', 'pass1234', 'Carlos', 'Martínez', 40123468, '1234567890', 'Av. Libertad 123', 'carlosmartinez@gmail.com', 1),
(53, 3, 'dr_sosa', 'pass5678', 'Ana', 'Sosa', 41123469, '1234567891', 'Calle Nueva 456', 'anasosa@gmail.com', 1),
(54, 3, 'dr_torres', 'pass9101', 'Roberto', 'Torres', 42123470, '1234567892', 'Calle Vieja 789', 'robertotorres@gmail.com', 1),
(55, 3, 'dr_perez', 'pass1121', 'Lucía', 'Pérez', 43123471, '1234567893', 'Calle Sol 101', 'luciaperez@gmail.com', 1),
(56, 3, 'dr_benitez', 'pass3141', 'Sergio', 'Benítez', 44123472, '1234567894', 'Calle Luna 202', 'sergiobenitez@gmail.com', 1),
(57, 3, 'dr_alvarez', 'pass5161', 'María', 'Álvarez', 45123473, '1234567895', 'Calle Estrella 303', 'mariaalvarez@gmail.com', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id_admin`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `agenda_base`
--
ALTER TABLE `agenda_base`
  ADD PRIMARY KEY (`id_agenda_base`),
  ADD KEY `id_sucursal` (`id_sucursal`),
  ADD KEY `id_estado_agenda` (`id_estado_agenda`),
  ADD KEY `id_clasificacion` (`id_clasificacion`),
  ADD KEY `matricula` (`matricula`);

--
-- Indices de la tabla `clasificacion_consulta`
--
ALTER TABLE `clasificacion_consulta`
  ADD PRIMARY KEY (`id_clasificacion`);

--
-- Indices de la tabla `dias`
--
ALTER TABLE `dias`
  ADD PRIMARY KEY (`id_dia`);

--
-- Indices de la tabla `dias_agendas`
--
ALTER TABLE `dias_agendas`
  ADD PRIMARY KEY (`id_dia`,`id_agenda_base`),
  ADD KEY `id_agenda_base` (`id_agenda_base`),
  ADD KEY `id_dia` (`id_dia`);

--
-- Indices de la tabla `dias_no_disponibles`
--
ALTER TABLE `dias_no_disponibles`
  ADD PRIMARY KEY (`id_dia_no_disponible`),
  ADD KEY `idx_dias_no_disponibles_agenda` (`id_agenda_base`),
  ADD KEY `idx_fecha` (`fecha`);

--
-- Indices de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  ADD PRIMARY KEY (`id_especialidad`);

--
-- Indices de la tabla `especialidades_profesional`
--
ALTER TABLE `especialidades_profesional`
  ADD PRIMARY KEY (`id_profesional`,`id_especialidad`),
  ADD KEY `id_especialidad` (`id_especialidad`),
  ADD KEY `matricula` (`matricula`);

--
-- Indices de la tabla `estados_turno`
--
ALTER TABLE `estados_turno`
  ADD PRIMARY KEY (`id_estado_turno`);

--
-- Indices de la tabla `estado_agenda`
--
ALTER TABLE `estado_agenda`
  ADD PRIMARY KEY (`id_estado_agenda`),
  ADD UNIQUE KEY `nombre_estado` (`nombre_estado`);

--
-- Indices de la tabla `lista_espera`
--
ALTER TABLE `lista_espera`
  ADD PRIMARY KEY (`id_lista_espera`),
  ADD KEY `id_turno` (`id_turno`);

--
-- Indices de la tabla `obra_social`
--
ALTER TABLE `obra_social`
  ADD PRIMARY KEY (`id_obra_social`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `obra_social_paciente`
--
ALTER TABLE `obra_social_paciente`
  ADD PRIMARY KEY (`id_paciente`,`id_obra_social`),
  ADD KEY `id_obra_social` (`id_obra_social`),
  ADD KEY `id_paciente` (`id_paciente`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id_paciente`),
  ADD UNIQUE KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `profesionales`
--
ALTER TABLE `profesionales`
  ADD PRIMARY KEY (`id_profesional`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `secre`
--
ALTER TABLE `secre`
  ADD PRIMARY KEY (`id_secre`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_sucursal` (`id_sucursal`);

--
-- Indices de la tabla `sucursal`
--
ALTER TABLE `sucursal`
  ADD PRIMARY KEY (`id_sucursal`);

--
-- Indices de la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD PRIMARY KEY (`id_turno`),
  ADD KEY `id_agenda_base` (`id_agenda_base`),
  ADD KEY `id_paciente` (`id_paciente`),
  ADD KEY `id_estado_turno` (`id_estado_turno`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `nombre_usuario` (`nombre_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `id_rol` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `admins`
--
ALTER TABLE `admins`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `agenda_base`
--
ALTER TABLE `agenda_base`
  MODIFY `id_agenda_base` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `clasificacion_consulta`
--
ALTER TABLE `clasificacion_consulta`
  MODIFY `id_clasificacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `dias`
--
ALTER TABLE `dias`
  MODIFY `id_dia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `dias_no_disponibles`
--
ALTER TABLE `dias_no_disponibles`
  MODIFY `id_dia_no_disponible` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `id_especialidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `estados_turno`
--
ALTER TABLE `estados_turno`
  MODIFY `id_estado_turno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `estado_agenda`
--
ALTER TABLE `estado_agenda`
  MODIFY `id_estado_agenda` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `lista_espera`
--
ALTER TABLE `lista_espera`
  MODIFY `id_lista_espera` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `obra_social`
--
ALTER TABLE `obra_social`
  MODIFY `id_obra_social` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id_paciente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `profesionales`
--
ALTER TABLE `profesionales`
  MODIFY `id_profesional` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `secre`
--
ALTER TABLE `secre`
  MODIFY `id_secre` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `sucursal`
--
ALTER TABLE `sucursal`
  MODIFY `id_sucursal` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id_turno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `admins_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `agenda_base`
--
ALTER TABLE `agenda_base`
  ADD CONSTRAINT `agenda_base_ibfk_2` FOREIGN KEY (`id_sucursal`) REFERENCES `sucursal` (`id_sucursal`),
  ADD CONSTRAINT `agenda_base_ibfk_4` FOREIGN KEY (`id_estado_agenda`) REFERENCES `estado_agenda` (`id_estado_agenda`),
  ADD CONSTRAINT `agenda_base_ibfk_5` FOREIGN KEY (`id_clasificacion`) REFERENCES `clasificacion_consulta` (`id_clasificacion`),
  ADD CONSTRAINT `agenda_base_ibfk_6` FOREIGN KEY (`matricula`) REFERENCES `especialidades_profesional` (`matricula`);

--
-- Filtros para la tabla `dias_agendas`
--
ALTER TABLE `dias_agendas`
  ADD CONSTRAINT `dias_agendas_ibfk_1` FOREIGN KEY (`id_agenda_base`) REFERENCES `agenda_base` (`id_agenda_base`),
  ADD CONSTRAINT `dias_agendas_ibfk_2` FOREIGN KEY (`id_dia`) REFERENCES `dias` (`id_dia`);

--
-- Filtros para la tabla `dias_no_disponibles`
--
ALTER TABLE `dias_no_disponibles`
  ADD CONSTRAINT `dias_no_disponibles_ibfk_1` FOREIGN KEY (`id_agenda_base`) REFERENCES `agenda_base` (`id_agenda_base`);

--
-- Filtros para la tabla `especialidades_profesional`
--
ALTER TABLE `especialidades_profesional`
  ADD CONSTRAINT `especialidades_profesional_ibfk_1` FOREIGN KEY (`id_profesional`) REFERENCES `profesionales` (`id_profesional`),
  ADD CONSTRAINT `especialidades_profesional_ibfk_2` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades` (`id_especialidad`);

--
-- Filtros para la tabla `lista_espera`
--
ALTER TABLE `lista_espera`
  ADD CONSTRAINT `lista_espera_ibfk_1` FOREIGN KEY (`id_turno`) REFERENCES `turnos` (`id_turno`);

--
-- Filtros para la tabla `obra_social_paciente`
--
ALTER TABLE `obra_social_paciente`
  ADD CONSTRAINT `obra_social_paciente_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`),
  ADD CONSTRAINT `obra_social_paciente_ibfk_2` FOREIGN KEY (`id_obra_social`) REFERENCES `obra_social` (`id_obra_social`);

--
-- Filtros para la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD CONSTRAINT `pacientes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `profesionales`
--
ALTER TABLE `profesionales`
  ADD CONSTRAINT `profesionales_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `secre`
--
ALTER TABLE `secre`
  ADD CONSTRAINT `secre_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD CONSTRAINT `turnos_ibfk_1` FOREIGN KEY (`id_agenda_base`) REFERENCES `agenda_base` (`id_agenda_base`),
  ADD CONSTRAINT `turnos_ibfk_2` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`),
  ADD CONSTRAINT `turnos_ibfk_5` FOREIGN KEY (`id_estado_turno`) REFERENCES `estados_turno` (`id_estado_turno`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
