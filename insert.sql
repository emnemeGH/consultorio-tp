-- ------------------------------
-- Reiniciar AUTO_INCREMENT en todas las tablas
-- ------------------------------
ALTER TABLE usuario AUTO_INCREMENT = 1;
ALTER TABLE especialidad AUTO_INCREMENT = 1;
ALTER TABLE cobertura AUTO_INCREMENT = 1;
ALTER TABLE agenda AUTO_INCREMENT = 1;
ALTER TABLE medico_especialidad AUTO_INCREMENT = 1;
ALTER TABLE turno AUTO_INCREMENT = 1;

-- ------------------------------
-- Insertar coberturas
-- ------------------------------
INSERT INTO cobertura (nombre) VALUES
('OSDE 210'),
('Swiss Medical'),
('Galeno'),
('Medicus'),
('Omint');

-- ------------------------------
-- Insertar especialidades
-- ------------------------------
INSERT INTO especialidad (descripcion) VALUES
('Cardiología'),
('Dermatología'),
('Pediatría'),
('Clínica Médica'),
('Neurología');

-- ------------------------------
-- Insertar usuarios (roles: medico, paciente, administrador, operador)
-- Texto = dos primeras letras del rol
-- ------------------------------
INSERT INTO usuario (apellido, nombre, fecha_nacimiento, password, rol, email, telefono, dni, id_cobertura) VALUES
('me','me','1980-01-01','me','medico','me@example.com','11111111','me',1),
('pa','pa','1990-02-02','pa','paciente','pa@example.com','22222222','pa',2),
('ad','ad','1985-03-03','ad','administrador','ad@example.com','33333333','ad',NULL),
('op','op','1992-04-04','op','operador','op@example.com','44444444','op',NULL);

-- ------------------------------
-- Insertar agenda
-- ------------------------------
-- id_medico 1 = "me"
-- id_especialidad 1 = Cardiología, 2 = Dermatología, etc
INSERT INTO agenda (hora_entrada, hora_salida, fecha, id_medico, id_especialidad) VALUES
('09:00','12:00','2025-10-14',1,1),
('13:00','16:00','2025-10-14',1,1),
('10:00','12:00','2025-10-15',1,2),
('14:00','16:00','2025-10-15',1,2),
('09:00','11:00','2025-10-16',1,3);

-- ------------------------------
-- Insertar medico_especialidad
-- ------------------------------
INSERT INTO medico_especialidad (id_medico, id_especialidad) VALUES
(1,1),
(1,2),
(1,3),
(1,4),
(1,5);

-- ------------------------------
-- Insertar turnos de ejemplo
-- ------------------------------
-- paciente 2 = "pa"
INSERT INTO turno (nota, id_agenda, fecha, hora, id_paciente, id_cobertura) VALUES
('Revisión de estudio',1,'2025-10-14','09:30',2,1),
('Continuación tratamiento',2,'2025-10-14','13:30',2,1),
('Consulta inicial',3,'2025-10-15','10:30',2,2),
('Chequeo de rutina',4,'2025-10-15','14:30',2,2),
('Control pediátrico',5,'2025-10-16','09:30',2,2);
