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

-- ------------------------------
-- Insertar más médicos
-- ------------------------------
INSERT INTO usuario (apellido, nombre, fecha_nacimiento, password, rol, email, telefono, dni, id_cobertura) VALUES
('Lopez','Ana','1982-05-05','ana','medico','ana@example.com','5551111','ana',1),
('Gomez','Pedro','1978-11-12','pedro','medico','pedro@example.com','5552222','pedro',2),
('Fernandez','Lucia','1985-03-21','lucia','medico','lucia@example.com','5553333','lucia',3),
('Martinez','Diego','1990-07-18','diego','medico','diego@example.com','5554444','diego',4),
('Sanchez','Carla','1979-09-09','carla','medico','carla@example.com','5555555','carla',5);

-- ------------------------------
-- Asociar médicos con especialidades
-- ------------------------------
-- id_medico 5 = Ana -> Cardiología
-- id_medico 6 = Pedro -> Dermatología
-- id_medico 7 = Lucia -> Pediatría
-- id_medico 8 = Diego -> Clínica Médica
-- id_medico 9 = Carla -> Neurología
INSERT INTO medico_especialidad (id_medico, id_especialidad) VALUES
(5,1),
(6,2),
(7,3),
(8,4),
(9,5);

-- ------------------------------
-- Opcional: agregar más agendas para los nuevos médicos
-- ------------------------------
INSERT INTO agenda (hora_entrada, hora_salida, fecha, id_medico, id_especialidad) VALUES
('08:00','12:00','2025-10-14',5,1),
('13:00','17:00','2025-10-14',6,2),
('09:00','13:00','2025-10-15',7,3),
('10:00','14:00','2025-10-15',8,4),
('09:30','12:30','2025-10-16',9,5);