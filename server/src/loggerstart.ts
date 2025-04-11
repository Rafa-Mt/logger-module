import { openDatabase, createSnapshot } from '@/services/db';
import LogManager from '@/models/Log';
import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';

import {CustomLog, RouteLog,HttpMethod} from '@/../../common/types.d'; 
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class LoggerServer {
    private db: any;
    private logs!: LogManager;
    private io!: SocketIOServer;

    private app: express.Application;
    private server: http.Server;

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.init();
    }

    private async init() {
        // Configuración del front (puerto 4596)
        const frontApp = express();
        const frontPort = 4596;

        frontApp.use(express.static(path.join(__dirname, '../../client/dist')));
        // Inicia el servidor del front
        frontApp.listen(frontPort, () => {
            console.log(`Front disponible en http://localhost:${frontPort}`);
        });

        this.logs = await LogManager.create()
        // Configura la base de datos y el modelo de logs
        this.db = await openDatabase('./static/db.sqlite');
        await LogManager.createModel(this.db);
        // Usa el método de fábrica para instanciar LogManager

        // Configura Socket.IO
        this.io = new SocketIOServer(this.server);
        this.io.on('connection', (socket) => {
            console.log('Cliente conectado al front');
        });

        // Endpoint para obtener logs (opcional)
        this.app.get('/logs', async (req, res) => {
            // Se pueden unir tanto los logs de rutas como los custom si se desea
            const routeLogs = await this.logs.getAllRouteLogs();
            const customLogs = await this.logs.getAllCustomLogs();
            res.json({ routeLogs, customLogs });
        });

        // Inicia el servidor de logs (puerto 4586)
        const logPort = 4586;
        this.server.listen(logPort, () => {
            console.log(`Servidor de logs disponible en http://localhost:${logPort}`);
        });
    }

    /**
     * Middleware para registrar automáticamente las rutas.
     * Se usa en app.use(logger.middleware())
     */
    public middleware() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const { method, path: reqPath } = req;
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            const body = JSON.stringify(req.body);
            const params = JSON.stringify(req.params);

            // Guarda los datos en res.locals para usarlos luego
            res.locals.logs = {
                method,
                path: reqPath,
                ip,
                body,
                params,
                startTime: new Date(),
            };

            // Función que se ejecuta justo antes de enviar la respuesta
            const logData = async () => {
                const data = res.locals.logs;
                // Registra la ruta en la base de datos
                await this.logs.logRoute({
                    ip: data.ip,
                    method: data.method as HttpMethod ,
                    endpoint: data.path,
                    body: JSON.parse(data.body || '{}'),
                    params: JSON.parse(data.params || '{}'),
                    timestamp: data.startTime
                });
                // Emite un evento al front para actualizar los logs
                this.io.emit('log', {
                    ip: data.ip,
                    endpoint: data.path,
                    method: data.method,
                    body: JSON.parse(data.body || '{}'),
                    params: JSON.parse(data.params || '{}'),
                    type: 'INFO'
                });
            };

            const originalSend = res.send;
            const originalJson = res.json;

            // Intercepta el envío de la respuesta para ejecutar el log
            res.send = function (body: any) {
                logData();
                return originalSend.call(this, body);
            };

            res.json = function (body: any) {
                logData();
                return originalJson.call(this, body);
            };

            next();
        };
    }

    /**
     * Registra un log de tipo DEBUG usando logCustom
     */
    public async debug(log: { ip: string; endpoint: string; method: string; body?: any; params?: any }) {
        await this.logs.logCustom({ type: 'DEBUG', message: JSON.stringify(log) });
        console.log('DEBUG log registrado:', log);
        // Envía el evento al front
        this.io.emit('log', { ...log, type: 'DEBUG' });
    }

    /**
     * Registra un log de tipo ERROR usando logCustom
     */
    public async error(log: { ip: string; endpoint: string; method: string; body?: any; params?: any }) {
        await this.logs.logCustom({ type: 'ERROR', message: JSON.stringify(log) });
        console.error('ERROR log registrado:', log);
        // Envía el evento al front
        this.io.emit('log', { ...log, type: 'ERROR' });
    }

    /**
     * Crea un snapshot de los logs
     */
    public async createSnapshot() {
        const snapshot = await createSnapshot();
        console.log('Snapshot creado:', snapshot);
        this.io.emit('snapshot', snapshot);
        return snapshot;
    }
}