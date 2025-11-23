import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';

export interface MockDb {
    usuarios: Usuario[];
    coberturas: Cobertura[];
    turnos: Turno[];
    especialidades: Especialidad[];
    medico_especialidad: MedicoEspecialidad[];
    agendas: Agenda[];
}

export interface Agenda {
    id: number;
    id_medico: number;
    id_especialidad: number;
    fecha: string;
    hora_entrada: string;
    hora_salida: string;
}


export interface Especialidad {
    id: number;
    descripcion: string;
}

export interface MedicoEspecialidad {
    id_medico: number;
    id_especialidad: number;
}

// Modelo real de usuario devuelto por tu backend
export interface Usuario {
    id: number;
    apellido: string;
    nombre: string;
    fecha_nacimiento: string;
    password: string;
    usuario: string;
    rol: string;
    email: string;
    telefono: string;
    dni: string;
    id_cobertura: number | null;
    nombre_cobertura?: string; // viene del JOIN
}

export interface Turno {
    id: number;
    nota: string;
    fecha: string;      // "2025-01-20"
    hora: string;       // "10:00"
    id_paciente: number;
    id_cobertura: number | null;
    nombre_medico: string;
    apellido_medico: string;
    id_especialidad: number;
    especialidad: string;
    id_agenda: number;
}

// Modelo cobertura
export interface Cobertura {
    id: number;
    nombre: string;
}

export class InMemoryDataService implements InMemoryDbService {

    createDb(): MockDb {

        // ================================
        //    MOCK: COBERTURAS
        // ================================
        const coberturas: Cobertura[] = [
            { id: 1, nombre: 'OSDE 210' },
            { id: 2, nombre: 'Swiss Medical' },
            { id: 3, nombre: 'Galeno Oro' }
        ];

        const turnos: Turno[] = [
            {
                id: 1,
                nota: "Control",
                fecha: "2025-11-23",
                hora: "10:00",
                id_paciente: 1,
                id_cobertura: 1,
                nombre_medico: "Emanuel",
                apellido_medico: "Neme",
                id_especialidad: 1,
                especialidad: "Cardiología",
                id_agenda: 2
            }
        ];


        // ================================
        //    MOCK: USUARIOS (JOIN incluido)
        // ================================
        const usuarios: Usuario[] = [
            {
                id: 1,
                apellido: 'Gomez',
                nombre: 'Juan',
                fecha_nacimiento: '1990-05-10',
                password: '123',
                usuario: 'paciente',
                rol: 'paciente',
                email: 'juan@test.com',
                telefono: '123456789',
                dni: '30123456',
                id_cobertura: 1,
                nombre_cobertura: 'OSDE 210'
            },
            {
                id: 2,
                apellido: 'Lopez',
                nombre: 'Maria',
                fecha_nacimiento: '1988-11-20',
                password: '123',
                usuario: 'admin',
                rol: 'administrador',
                email: 'maria@example.com',
                telefono: '987654321',
                dni: '28999888',
                id_cobertura: null,
                nombre_cobertura: ""
            },
            {
                id: 3,
                apellido: 'Neme',
                nombre: 'Emanuel',
                fecha_nacimiento: '1988-11-20',
                password: '123',
                usuario: 'medico',
                rol: 'medico',
                email: 'maria@example.com',
                telefono: '987654321',
                dni: '28999888',
                id_cobertura: null,
                nombre_cobertura: ""
            },
            {
                id: 4,
                apellido: 'Cardilli',
                nombre: 'Jose',
                fecha_nacimiento: '1988-11-20',
                password: '123',
                usuario: 'medico2',
                rol: 'medico',
                email: 'maria@example.com',
                telefono: '987654321',
                dni: '28999888',
                id_cobertura: null,
                nombre_cobertura: ""
            },
            {
                id: 5,
                apellido: 'Filardi',
                nombre: 'Mario',
                fecha_nacimiento: '1988-11-20',
                password: '123',
                usuario: 'medico3',
                rol: 'medico',
                email: 'maria@example.com',
                telefono: '987654321',
                dni: '28999888',
                id_cobertura: null,
                nombre_cobertura: ""
            },
            {
                id: 6,
                apellido: 'Gomez',
                nombre: 'Juan',
                fecha_nacimiento: '1988-11-20',
                password: '123',
                usuario: 'operador',
                rol: 'operador',
                email: 'maria@example.com',
                telefono: '987654321',
                dni: '28999888',
                id_cobertura: null,
                nombre_cobertura: ""
            }
        ];

        const especialidades: Especialidad[] = [
            { id: 1, descripcion: 'Cardiología' },
            { id: 2, descripcion: 'Dermatología' },
            { id: 3, descripcion: 'Pediatría' }
        ];

        const medico_especialidad: MedicoEspecialidad[] = [
            { id_medico: 3, id_especialidad: 1 },
            { id_medico: 4, id_especialidad: 1 },
            { id_medico: 5, id_especialidad: 2 },
        ];

        const agendas = [
            {
                id: 1,
                id_medico: 3,
                id_especialidad: 1,
                fecha: "2025-11-24",
                hora_entrada: "08:00",
                hora_salida: "12:00"
            },
            {
                id: 2,
                id_medico: 3,
                id_especialidad: 1,
                fecha: "2025-11-23",
                hora_entrada: "10:00",
                hora_salida: "14:00"
            }
        ];

        return { usuarios, coberturas, turnos, especialidades, medico_especialidad, agendas };
    }

    // ================================================
    //        ENDPOINTS PERSONALIZADOS
    // ================================================
    get(reqInfo: RequestInfo) {
        const collection = reqInfo.collectionName;

        // GET /api/obtenerUsuarios
        if (reqInfo.url.endsWith('/obtenerUsuarios')) {
            const db = reqInfo.utils.getDb() as MockDb;

            return reqInfo.utils.createResponse$(() => ({
                body: {
                    codigo: 200,
                    mensaje: 'OK',
                    payload: db.usuarios
                },
                status: 200
            }));
        }

        // GET /api/obtenerUsuario/:id
        if (reqInfo.url.includes('/obtenerUsuario/')) {
            const db = reqInfo.utils.getDb() as MockDb;

            const id = Number(reqInfo.id);
            const user = db.usuarios.find(u => u.id === id);

            return reqInfo.utils.createResponse$(() => ({
                body: user
                    ? { codigo: 200, mensaje: 'OK', payload: [user] }
                    : { codigo: -1, mensaje: 'Usuario no encontrado', payload: [] },
                status: 200
            }));
        }

        // GET /api/obtenerCoberturas
        if (reqInfo.url.endsWith('/obtenerCoberturas')) {
            const db = reqInfo.utils.getDb() as MockDb;

            return reqInfo.utils.createResponse$(() => ({
                body: {
                    codigo: 200,
                    mensaje: 'OK',
                    payload: db.coberturas
                },
                status: 200
            }));
        }

        if (reqInfo.url.includes('/obtenerTurnoPaciente/')) {
            const db = reqInfo.utils.getDb() as MockDb;

            const idPaciente = Number(reqInfo.id);
            const lista = db.turnos.filter(t => t.id_paciente === idPaciente);

            return reqInfo.utils.createResponse$(() => ({
                body: {
                    codigo: 200,
                    mensaje: "OK",
                    payload: lista
                },
                status: 200
            }));
        }

        if (reqInfo.url.endsWith('/obtenerEspecialidades')) {
            const db = reqInfo.utils.getDb() as any;

            return reqInfo.utils.createResponse$(() => ({
                body: {
                    codigo: 200,
                    mensaje: 'OK',
                    payload: db.especialidades
                },
                status: 200
            }));
        }

        if (reqInfo.url.includes('/obtenerEspecialidadesMedico/')) {
            const db = reqInfo.utils.getDb() as any;
            const id = Number(reqInfo.id);

            const lista = db.medico_especialidad
                .filter((m: MedicoEspecialidad) => m.id_medico === id)
                .map((m: MedicoEspecialidad) => {
                    const esp = db.especialidades.find((e: Especialidad) => e.id === m.id_especialidad);
                    return {
                        id_medico: m.id_medico,
                        id_especialidad: m.id_especialidad,
                        descripcion: esp?.descripcion ?? ""
                    };
                });

            return reqInfo.utils.createResponse$(() => ({
                body: { codigo: 200, mensaje: 'OK', payload: lista },
                status: 200
            }));
        }

        if (reqInfo.url.includes('/obtenerMedicoPorEspecialidad/')) {
            const db = reqInfo.utils.getDb() as any;
            const id = Number(reqInfo.id);

            const lista = db.medico_especialidad
                .filter((m: MedicoEspecialidad) => m.id_especialidad === id)
                .map((m: MedicoEspecialidad) => {
                    const medico = db.usuarios.find((u: Usuario) => u.id === m.id_medico);
                    return {
                        id_medico: m.id_medico,
                        id_especialidad: id,
                        nombre: medico?.nombre ?? "",
                        apellido: medico?.apellido ?? ""
                    };
                });

            return reqInfo.utils.createResponse$(() => ({
                body: { codigo: 200, mensaje: 'OK', payload: lista },
                status: 200
            }));
        }

        if (reqInfo.url.includes('/obtenerAgenda/')) {
            const db = reqInfo.utils.getDb() as MockDb;
            const idMedico = Number(reqInfo.id);

            const lista = db.agendas.filter(a => a.id_medico === idMedico);

            return reqInfo.utils.createResponse$(() => ({
                body: { codigo: 200, mensaje: 'OK', payload: lista },
                status: 200
            }));
        }


        return undefined; // fallback default
    }

    // POST /api/crearUsuario
    post(reqInfo: RequestInfo) {
        if (reqInfo.url.endsWith('/login')) {
            const db = reqInfo.utils.getDb() as MockDb;
            const body = reqInfo.utils.getJsonBody(reqInfo.req);

            const { usuario, password } = body;

            const user = db.usuarios.find(
                u => u.usuario === usuario && u.password === password
            );

            if (!user) {
                return reqInfo.utils.createResponse$(() => ({
                    body: {
                        codigo: -1,
                        mensaje: "Usuario o contraseña incorrecta",
                        payload: []
                    },
                    status: 200
                }));
            }

            const fakeToken = "mock-token-" + user.id;

            const payload = [{
                id: user.id,
                nombre: user.nombre,
                apellido: user.apellido,
                rol: user.rol
            }];

            return reqInfo.utils.createResponse$(() => ({
                body: {
                    codigo: 200,
                    mensaje: "OK",
                    payload,
                    jwt: fakeToken
                },
                status: 200
            }));
        }

        if (reqInfo.url.endsWith('/crearUsuario')) {
            const body = reqInfo.utils.getJsonBody(reqInfo.req);
            const db = reqInfo.utils.getDb() as MockDb;

            const newId = Math.max(...db.usuarios.map((u: any) => u.id), 0) + 1;

            const cobertura = db.coberturas.find((c: Cobertura) => c.id === body.id_cobertura);

            const nuevo = {
                ...body,
                id: newId,
                nombre_cobertura: cobertura ? cobertura.nombre : null
            };

            db.usuarios.push(nuevo);

            return reqInfo.utils.createResponse$(() => ({
                body: {
                    codigo: 200,
                    mensaje: 'Usuario añadido',
                    payload: [{ id_usuario: newId }]
                },
                status: 200
            }));
        }

        // POST /api/crearCobertura
        if (reqInfo.url.endsWith('/crearCobertura')) {
            const body = reqInfo.utils.getJsonBody(reqInfo.req);
            const db = reqInfo.utils.getDb() as MockDb;;

            const newId = Math.max(...db.coberturas.map((c: any) => c.id), 0) + 1;
            db.coberturas.push({ id: newId, nombre: body.nombre });

            return reqInfo.utils.createResponse$(() => ({
                body: { codigo: 200, mensaje: 'Cobertura añadida', payload: [] },
                status: 200
            }));
        }

        if (reqInfo.url.endsWith('/asignarTurnoPaciente')) {
            const db = reqInfo.utils.getDb() as MockDb;
            const body = reqInfo.utils.getJsonBody(reqInfo.req);

            const newId = Math.max(...db.turnos.map(t => t.id), 0) + 1;

            const nuevoTurno = {
                ...body,
                id: newId,
                nombre_medico: "MockMedico",
                apellido_medico: "MockApellido",
                especialidad: "Mock Especialidad",
                id_especialidad: 1
            };

            db.turnos.push(nuevoTurno);

            return reqInfo.utils.createResponse$(() => ({
                body: { codigo: 200, message: "Turno asignado correctamente", payload: [] },
                status: 200
            }));
        }

        if (reqInfo.url.endsWith('/crearEspecialidad')) {
            const db = reqInfo.utils.getDb() as any;
            const body = reqInfo.utils.getJsonBody(reqInfo.req);

            const newId = Math.max(...db.especialidades.map((e: any) => e.id), 0) + 1;

            db.especialidades.push({ id: newId, descripcion: body.descripcion });

            return reqInfo.utils.createResponse$(() => ({
                body: { codigo: 200, mensaje: 'Especialidad añadida', payload: [] },
                status: 200
            }));
        }

        if (reqInfo.url.endsWith('/crearAgenda')) {
            const db = reqInfo.utils.getDb() as MockDb;
            const body = reqInfo.utils.getJsonBody(reqInfo.req);

            const newId = Math.max(...db.agendas.map(a => a.id), 0) + 1;

            const nueva = { id: newId, ...body };

            db.agendas.push(nueva);

            return reqInfo.utils.createResponse$(() => ({
                body: { codigo: 200, mensaje: 'Agenda creada', payload: [{ id: newId }] },
                status: 200
            }));
        }

        return undefined;
    }

    // PUT /api/actualizarUsuario/:id
    put(reqInfo: RequestInfo) {
        if (reqInfo.url.includes('/actualizarUsuario/')) {
            const id = Number(reqInfo.id);
            const body = reqInfo.utils.getJsonBody(reqInfo.req);
            const db = reqInfo.utils.getDb() as MockDb;;

            const usuario = db.usuarios.find((u: any) => u.id === id);

            if (usuario) {
                Object.assign(usuario, body);

                if (body.id_cobertura !== undefined) {
                    const c = db.coberturas.find((x: Cobertura) => x.id === body.id_cobertura);
                    usuario.nombre_cobertura = c ? c.nombre : "";
                }

                return reqInfo.utils.createResponse$(() => ({
                    body: { codigo: 200, mensaje: 'Usuario modificado', payload: [] },
                    status: 200
                }));
            }

            return reqInfo.utils.createResponse$(() => ({
                body: { codigo: -1, mensaje: 'Usuario no encontrado', payload: [] },
                status: 200
            }));
        }

        // PUT /api/modificarCobertura
        if (reqInfo.url.endsWith('/modificarCobertura')) {
            const body = reqInfo.utils.getJsonBody(reqInfo.req);
            const db = reqInfo.utils.getDb() as MockDb;;

            const c = db.coberturas.find((x: Cobertura) => x.id === body.id);

            if (c) c.nombre = body.nombre;

            return reqInfo.utils.createResponse$(() => ({
                body: { codigo: 200, mensaje: 'Cobertura modificada', payload: [] },
                status: 200
            }));
        }

        if (reqInfo.url.endsWith('/modificarEspecialidad')) {
            const db = reqInfo.utils.getDb() as any;
            const body = reqInfo.utils.getJsonBody(reqInfo.req);

            const esp = db.especialidades.find((e: any) => e.id === body.id);

            if (esp) esp.descripcion = body.descripcion;

            return reqInfo.utils.createResponse$(() => ({
                body: { codigo: 200, mensaje: 'Especialidad modificada', payload: [] },
                status: 200
            }));
        }


        return undefined;
    }

    // DELETE /api/eliminarCobertura/:id
    delete(reqInfo: RequestInfo) {
        if (reqInfo.url.includes('/eliminarCobertura/')) {
            const id = Number(reqInfo.id);
            const db = reqInfo.utils.getDb() as MockDb;;

            db.coberturas = db.coberturas.filter((x: Cobertura) => x.id !== id);

            return reqInfo.utils.createResponse$(() => ({
                body: { codigo: 200, mensaje: 'Cobertura eliminada', payload: [] },
                status: 200
            }));
        }

        if (reqInfo.url.includes('/eliminarTurnoPaciente/')) {
            const db = reqInfo.utils.getDb() as MockDb;

            const id = Number(reqInfo.id);
            db.turnos = db.turnos.filter(t => t.id !== id);

            return reqInfo.utils.createResponse$(() => ({
                body: { codigo: 200, mensaje: "Turno eliminado", payload: [] },
                status: 200
            }));
        }

        if (reqInfo.url.includes('/eliminarEspecialidad/')) {
            const db = reqInfo.utils.getDb() as any;
            const id = Number(reqInfo.id);

            db.especialidades = db.especialidades.filter((e: any) => e.id !== id);
            db.medico_especialidad = db.medico_especialidad.filter((m: any) => m.id_especialidad !== id);

            return reqInfo.utils.createResponse$(() => ({
                body: { codigo: 200, mensaje: 'Especialidad eliminada', payload: [] },
                status: 200
            }));
        }

        if (reqInfo.url.includes('/eliminarAgenda/')) {
            const db = reqInfo.utils.getDb() as MockDb;
            const id = Number(reqInfo.id);

            db.agendas = db.agendas.filter(a => a.id !== id);

            return reqInfo.utils.createResponse$(() => ({
                body: { codigo: 200, mensaje: 'Agenda eliminada', payload: [] },
                status: 200
            }));
        }

        return undefined;
    }
}
