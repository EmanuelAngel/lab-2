CREATE TABLE especialidades (
	id_especialidad INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  nombre VARCHAR(100) UNIQUE NOT NULL
)

-- Insertar datos de ejemplo

INSERT INTO especialidades (nombre) VALUES ('Cardiología');
INSERT INTO especialidades (nombre) VALUES ('Dermatología');
INSERT INTO especialidades (nombre) VALUES ('Farmacología');
INSERT INTO especialidades (nombre) VALUES ('Gastroenterología');
INSERT INTO especialidades (nombre) VALUES ('Hematología');
INSERT INTO especialidades (nombre) VALUES ('Medicina Interna');
INSERT INTO especialidades (nombre) VALUES ('Neurología');
INSERT INTO especialidades (nombre) VALUES ('Odontología');
INSERT INTO especialidades (nombre) VALUES ('Ortopedia');
INSERT INTO especialidades (nombre) VALUES ('Pediatría');
INSERT INTO especialidades (nombre) VALUES ('Urología');
