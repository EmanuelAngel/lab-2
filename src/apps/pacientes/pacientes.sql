CREATE TABLE Pacientes (
    id_paciente INT AUTO_INCREMENT PRIMARY KEY,
    apellido VARCHAR(100) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    dni VARCHAR(20) UNIQUE NOT NULL,
    obra_social VARCHAR(100)  NOT NULL,
    telefono VARCHAR(20) UNIQUE  NOT NULL,
    email VARCHAR(100) UNIQUE  NOT NULL,
    direccion VARCHAR(255)  NOT NULL,
    es_profesional BOOLEAN DEFAULT FALSE NOT NULL,
    estado BOOLEAN DEFAULT TRUE NOT NULL
);



INSERT INTO Pacientes (apellido, nombre, dni, obra_social, telefono, email, direccion, es_profesional, estado) VALUES
('Gómez', 'Juan Carlos', '30123456', 'DOSEP', '2664556789', 'juan.gomez@example.com', 'Av. Lafinur 123, San Luis, San Luis', FALSE, TRUE),
('Pérez', 'Ana María', '29123456', 'DOSPU', '2664234567', 'ana.perez@example.com', 'Calle Las Heras 456, Villa Mercedes, San Luis', FALSE, TRUE),
('Rodríguez', 'Carlos Alberto', '27123456', 'MediSaludSanLuis', '2664876543', 'carlos.rodriguez@example.com', 'Calle Pringles 789, San Luis, San Luis', FALSE, TRUE),
('Fernández', 'Lucía', '26123456', 'swiss medical', '2664987654', 'lucia.fernandez@example.com', 'Ruta 3 km 5, Juana Koslay, San Luis', TRUE, TRUE),
('Sosa', 'Miguel Ángel', '31123456', 'DOSEP', '2664321122', 'miguel.sosa@example.com', 'B° Jardín del Sur, Villa Mercedes, San Luis', FALSE, TRUE);
