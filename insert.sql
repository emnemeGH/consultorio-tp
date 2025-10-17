-- ------------------------------
-- Reiniciar AUTO_INCREMENT en todas las tablas
-- ------------------------------
ALTER TABLE usuario AUTO_INCREMENT = 1;
ALTER TABLE especialidad AUTO_INCREMENT = 1;
ALTER TABLE cobertura AUTO_INCREMENT = 1;
ALTER TABLE agenda AUTO_INCREMENT = 1;
ALTER TABLE medico_especialidad AUTO_INCREMENT = 1;
ALTER TABLE turno AUTO_INCREMENT = 1;


INSERT INTO cobertura (nombre) VALUES
('OSDE 210'),
('Swiss Medical'),
('Galeno'),
('Medicus'),
('Omint');


INSERT INTO especialidad (descripcion) VALUES
('Cardiología'),
('Dermatología'),
('Pediatría'),
('Clínica Médica'),
('Neurología');


INSERT INTO usuario (apellido, nombre, fecha_nacimiento, password, rol, email, telefono, dni, id_cobertura) VALUES
('me','me','1980-01-01','me','medico','me@example.com','11111111','me',1),
('pa','pa','1990-02-02','pa','paciente','pa@example.com','22222222','pa',2),
('ad','ad','1985-03-03','ad','administrador','ad@example.com','33333333','ad',NULL),
('op','op','1992-04-04','op','operador','op@example.com','44444444','op',NULL);
INSERT INTO usuario (apellido, nombre, fecha_nacimiento, password, rol, email, telefono, dni, id_cobertura) VALUES
('Perez', 'Camila', '1995-01-12', 'ca', 'paciente', 'camila@example.com', '5556661', 'ca', 1),
('Rodriguez', 'Lucas', '1992-03-22', 'lu', 'paciente', 'lucas@example.com', '5556662', 'lu', 2),
('Torres', 'Bruno', '1998-07-08', 'br', 'paciente', 'bruno@example.com', '5556663', 'br', 3),
('Mendoza', 'Sofia', '1994-09-15', 'so', 'paciente', 'sofia@example.com', '5556664', 'so', 4),
('Alvarez', 'Diego', '1990-12-03', 'di', 'paciente', 'diego@example.com', '5556665', 'di', 5);

INSERT INTO usuario (apellido, nombre, fecha_nacimiento, password, rol, email, telefono, dni, id_cobertura) VALUES
('Lopez','Ana','1982-05-05','ana','medico','ana@example.com','5551111','ana',1),
('Gomez','Pedro','1978-11-12','pedro','medico','pedro@example.com','5552222','pedro',2),
('Fernandez','Lucia','1985-03-21','lucia','medico','lucia@example.com','5553333','lucia',3),
('Martinez','Diego','1990-07-18','diego','medico','diego@example.com','5554444','diego',4),
('Sanchez','Carla','1979-09-09','carla','medico','carla@example.com','5555555','carla',5);
INSERT INTO usuario (apellido, nombre, fecha_nacimiento, password, rol, email, telefono, dni, id_cobertura) VALUES
('Romero', 'Nicolas', '1980-02-10', 'ni', 'medico', 'nicolas@example.com', '5557771', 'ni', 1),
('Benitez', 'Carolina', '1983-05-25', 'ca', 'medico', 'carolina@example.com', '5557772', 'ca', 2),
('Herrera', 'Mariano', '1986-08-30', 'ma', 'medico', 'mariano@example.com', '5557773', 'ma', 3),
('Diaz', 'Valentina', '1989-11-18', 'va', 'medico', 'valentina@example.com', '5557774', 'va', 4),
('Silva', 'Ezequiel', '1984-04-07', 'ez', 'medico', 'ezequiel@example.com', '5557775', 'ez', 5);


INSERT INTO agenda (hora_entrada, hora_salida, fecha, id_medico, id_especialidad) VALUES
('09:00','12:00','2025-11-03',1,1),
('13:00','16:00','2025-11-04',1,1),
('10:00','12:00','2025-11-05',1,2),
('14:00','16:00','2025-11-06',1,2),
('09:00','11:00','2025-11-07',1,3);

INSERT INTO agenda (hora_entrada, hora_salida, fecha, id_medico, id_especialidad) VALUES
('09:00','12:00','2025-11-03',10,1),
('13:00','16:00','2025-11-04',11,2),
('09:30','12:30','2025-11-05',12,3),
('10:00','13:00','2025-11-06',13,4),
('14:00','17:00','2025-11-07',14,5);
INSERT INTO agenda (hora_entrada, hora_salida, fecha, id_medico, id_especialidad) VALUES
('13:00','17:00','2025-11-03',15,1),
('09:00','13:00','2025-11-04',16,2),
('10:00','14:00','2025-11-05',17,3),
('09:30','12:30','2025-11-06',18,4),
('08:00','12:00','2025-11-07',19,5);



INSERT INTO medico_especialidad (id_medico, id_especialidad) VALUES
(1,1),
(1,2),
(1,3),
(10,1),
(11,2),
(12,3),
(13,4),
(14,5);

INSERT INTO medico_especialidad (id_medico, id_especialidad) VALUES
(15, 1),
(16, 2), 
(17, 3), 
(18, 4),
(19, 5);



INSERT INTO turno (nota, id_agenda, fecha, hora, id_paciente, id_cobertura) VALUES
('Revisión de estudio',1,'2025-11-03','09:30',2,1);


