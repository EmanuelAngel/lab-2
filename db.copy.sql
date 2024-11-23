-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 23, 2024 at 11:09 PM
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

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `AsignarTurno` (IN `p_id_turno` INT, IN `p_id_paciente` INT, IN `p_motivo_consulta` TEXT, OUT `p_resultado` BOOLEAN, OUT `p_mensaje` VARCHAR(255))   BEGIN
    DECLARE v_estado_actual INT;
    
    START TRANSACTION;
    
    SELECT id_estado_turno INTO v_estado_actual
    FROM turnos 
    WHERE id_turno = p_id_turno
    FOR UPDATE;
    
    IF v_estado_actual IS NULL THEN
        SET p_resultado = FALSE;
        SET p_mensaje = 'Turno no encontrado';
        ROLLBACK;
    ELSEIF v_estado_actual != 2 THEN
        SET p_resultado = FALSE;
        SET p_mensaje = 'El turno no está libre';
        ROLLBACK;
    ELSE
        UPDATE turnos 
        SET id_estado_turno = 1,
            id_paciente = p_id_paciente,
            motivo_consulta = p_motivo_consulta
        WHERE id_turno = p_id_turno;
        
        SET p_resultado = TRUE;
        SET p_mensaje = 'Turno asignado correctamente';
        COMMIT;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `EliminarTodosLosTurnos` (IN `p_id_agenda_base` INT, IN `p_fecha_inicio` DATE, IN `p_fecha_fin` DATE)   BEGIN
    -- Eliminar los turnos que coincidan con los parámetros
    DELETE FROM turnos 
    WHERE id_agenda_base = p_id_agenda_base
    AND fecha BETWEEN p_fecha_inicio AND p_fecha_fin
    -- Opcionalmente, puedes agregar más condiciones, por ejemplo:
    -- AND id_estado_turno = 2  -- Solo eliminar turnos libres
    -- AND fecha >= CURDATE()   -- Solo eliminar turnos futuros
    ;
    
    -- Opcionalmente, puedes retornar el número de turnos eliminados
    SELECT ROW_COUNT() as turnos_eliminados;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GenerarTurnos` (IN `p_id_agenda_base` INT, IN `p_fecha_inicio` DATE, IN `p_fecha_fin` DATE)   BEGIN
    DECLARE v_fecha_actual DATE;
    DECLARE v_dia_semana INT;
    DECLARE v_horario_inicio TIME;
    DECLARE v_horario_fin TIME;
    DECLARE v_hora_turno TIME;
    DECLARE v_duracion_turno INT;
    DECLARE done INT DEFAULT FALSE;
    
    -- Declarar el cursor para las franjas horarias
    DECLARE franja_cursor CURSOR FOR 
        SELECT horario_inicio, horario_fin 
        FROM dias_agendas
        WHERE id_agenda_base = p_id_agenda_base 
        AND estado = 1
        AND id_dia = v_dia_semana;
    
    -- Declarar handler para cuando no hay más registros
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    -- Obtener la duración del turno de agenda_base
    SELECT duracion_turno 
    INTO v_duracion_turno 
    FROM agenda_base 
    WHERE id_agenda_base = p_id_agenda_base;
    
    -- Iniciar en la fecha de inicio
    SET v_fecha_actual = p_fecha_inicio;
    
    -- Iterar por cada día en el rango de fechas
    WHILE v_fecha_actual <= p_fecha_fin DO
        -- Obtener el día de la semana (1=Domingo, 2=Lunes, ..., 7=Sábado)
        SET v_dia_semana = DAYOFWEEK(v_fecha_actual);
        
        -- Abrir el cursor
        OPEN franja_cursor;
        
        read_loop: LOOP
            FETCH franja_cursor INTO v_horario_inicio, v_horario_fin;
            
            IF done THEN 
                LEAVE read_loop;
            END IF;
            
            -- Iniciar en el primer horario
            SET v_hora_turno = v_horario_inicio;
            SET done = FALSE;
            
            -- Generar turnos mientras estemos dentro del horario
            WHILE ADDTIME(v_hora_turno, SEC_TO_TIME(v_duracion_turno * 60)) <= v_horario_fin DO
                -- Verificar si ya existe un turno para esta fecha y hora
                IF NOT EXISTS (
                    SELECT 1 
                    FROM turnos 
                    WHERE id_agenda_base = p_id_agenda_base
                    AND fecha = v_fecha_actual
                    AND horario_inicio = v_hora_turno
                ) THEN
                    -- Insertar el turno
                    INSERT INTO turnos (
                        id_agenda_base,
                        fecha,
                        horario_inicio,
                        horario_fin,
                        id_estado_turno
                    ) VALUES (
                        p_id_agenda_base,
                        v_fecha_actual,
                        v_hora_turno,
                        ADDTIME(v_hora_turno, SEC_TO_TIME(v_duracion_turno * 60)),
                        2  -- Cambiado a estado 2 'LIBRE'
                    );
                END IF;
                
                -- Avanzar al siguiente horario
                SET v_hora_turno = ADDTIME(v_hora_turno, SEC_TO_TIME(v_duracion_turno * 60));
            END WHILE;
        END LOOP;
        
        -- Cerrar el cursor
        CLOSE franja_cursor;
        SET done = FALSE;
        
        -- Avanzar al siguiente día
        SET v_fecha_actual = DATE_ADD(v_fecha_actual, INTERVAL 1 DAY);
    END WHILE;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ObtenerTurnosAgenda` (IN `p_id_agenda_base` INT, IN `p_fecha_inicio` DATE, IN `p_fecha_fin` DATE)   BEGIN
    SELECT 
        t.id_turno,
        t.fecha,
        d.dia as dia_semana,
        TIME_FORMAT(t.horario_inicio, '%H:%i') as hora_inicio,
        TIME_FORMAT(t.horario_fin, '%H:%i') as hora_fin,
        et.nombre_estado as estado,
        t.id_paciente,
        t.motivo_consulta
    FROM turnos t
    JOIN dias d ON d.id_dia = DAYOFWEEK(t.fecha)
    JOIN estados_turno et ON et.id_estado_turno = t.id_estado_turno
    WHERE t.id_agenda_base = p_id_agenda_base
    AND (
        (p_fecha_inicio IS NULL AND p_fecha_fin IS NULL) -- Si ambas son NULL, mostrar todos
        OR 
        (t.fecha BETWEEN p_fecha_inicio AND p_fecha_fin) -- Si no, filtrar por rango
    )
    ORDER BY t.fecha, t.horario_inicio;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `TestProcedure` ()   BEGIN
    SELECT 'Hello World' as mensaje;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `VerTurnosGenerados` (IN `p_fecha_inicio` DATE, IN `p_fecha_fin` DATE)   BEGIN
    SELECT 
        t.fecha,
        d.dia as dia_semana,  -- Usando la tabla dias que ya tienes
        TIME_FORMAT(t.horario_inicio, '%H:%i') as hora_inicio,
        TIME_FORMAT(t.horario_fin, '%H:%i') as hora_fin,
        CASE 
            WHEN t.id_estado_turno = 1 THEN 'LIBRE'
            WHEN t.id_estado_turno = 2 THEN 'RESERVADO'
            -- Agregar más estados según corresponda
            ELSE 'OTRO'
        END as estado
    FROM turnos t
    JOIN dias d ON d.id_dia = DAYOFWEEK(t.fecha)
    WHERE t.fecha BETWEEN p_fecha_inicio AND p_fecha_fin
    ORDER BY t.fecha, t.horario_inicio;
END$$

DELIMITER ;

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
(1, 2, 'PROF9897', 0),
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
(11, 5, 'PGIRA123', 1),
(12, 3, 'MAT-233', 1);

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
(41, 3, '2024-11-10 01:52:25', 1),
(42, 3, '2024-11-15 05:08:18', 1);

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
(41, 1, 1, 71, NULL),
(42, 1, 1, 73, NULL);

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
(11, 1, 50),
(12, 1, 72);

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
(121, 1, 33, 1, '2024-12-02', '10:20:00', '10:40:00', 'Test'),
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
(57, 3, 'dr_alvarez', 'pass5161', 'María', 'Álvares', 45123473, '1234567895', 'Calle Estrella 303', 'mariaalvarez@gmail.com', 1),
(64, 4, 'Pere', '$2b$10$5f8f23BvUc5AjBb.t7mpiOoJt87uW4YtMDo.51fs4B8Z19hCBePWy', 'Pere', 'Pere', 12345699, '12345678', 'C/ Juan Perez, 1', 'PerePere@gmail.com', 1),
(65, 4, 'Seba', '$2b$10$uUeDa5I/suWLJ6ELQwUAwu.dYBS1bg6sCVsfdgDanmVBA5Z/Pw2im', 'Seba', 'Seba', 12345699, '12345678', 'C/ Juan Seba, 1', 'SebaSeba@gmail.com', 1),
(67, 4, 'Pedrito', '$2b$10$ZcDNtDNymZMOVVNaaTIXsehXhZnAQUzs1RjsNUh3wJkjTEa6mdhEu', 'Pedrito', 'Pedrito', 12345699, '12345678', 'C/ Juan Seba, 1', 'PedritoPedrito@gmail.com', 1),
(68, 4, 'TESTPR', '$2b$10$bcx1W2Yd5JUt7icWHGSw7eiuCQcqCmO3VDsmVwvTCtn/FzRHyIv1y', 'PACIENTE1', 'REGISTRO', 33666999, '121212', 'En algún lugar', 'TESTPACIENTE@gmail.com', 1),
(71, 4, 'TESTPR3', '$2b$10$K4KhDbs74TndkX5Lf.zy..gFaAIjgf0k32wKxp5oFUKmDzpJBN572', 'PACIENTE3', 'REGISTRO3', 44600506, '121212', 'En algún lugar', 'TESTPACIENTE3@gmail.com', 1),
(72, 3, 'TEST999', '$2b$10$aaDe87YPr5FMqsHNht4HceBUVzfSFK/rHKds4fN6CzbmDFH5oNHBy', 'Adolfo', 'Villaruel', 23444555, '777886', 'En algún lugar', 'adolfovillaruel@live.com', 1),
(73, 4, 'J_SANTANA', '$2b$10$0EjPZGN2g0CCRe0ikLGnneV4afk9N2B1ievVR0mMXCaTfw4FeHrIO', 'Jorge', 'Santana', 348888555, '777886', 'En algún lugar', 'jsantana@live.com', 1);

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
  MODIFY `id_paciente` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `profesionales`
--
ALTER TABLE `profesionales`
  MODIFY `id_profesional` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

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
  MODIFY `id_usuario` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
