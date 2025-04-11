import { openDatabase, createSnapshot } from '@/services/db';
import LogManager from '@/models/Log';
import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';

import {CustomLog, RouteLog, HttpMethod} from '@/../../common/types.d'; 
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';

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
        this.app.use(cors({origin: '*'}));
        this.server = http.createServer(this.app);
        this.init();
    }

    private async init() {
        // Configuración del front (puerto 4596)
        const frontApp = express();
        frontApp.use(cors({origin: '*'}));
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
        this.io = new SocketIOServer(this.server, { cors: { origin: '*' } });
        this.io.on('connection', (socket) => {
            console.log('Cliente conectado al front');
        });

        this.logs.attatchSocket(this.io);
        // Endpoint para obtener logs (opcional)
        this.app.get('/logs', async (req, res) => {
            // Se pueden unir tanto los logs de rutas como los custom si se desea
            const routeLogs = await this.logs.getAllRouteLogs();
            const customLogs = await this.logs.getAllCustomLogs();
            res.json({ routeLogs, customLogs });
        });

        this.app.get('/logs/route', async (req, res) => {
            const routeLogs = await this.logs.getAllRouteLogs();
            res.json({ routeLogs });
        });

        this.app.get('/logs/custom', async (req, res) => {
            const customLogs = await this.logs.getAllCustomLogs();
            res.json({ customLogs });
        });

        this.app.get("/chart", async (req, res) => {    
            const values = await this.logs.groupByType();
            res.json(values);
        });

        setInterval(() => {
            const memoryUsage = process.memoryUsage();
            const cpuUsage = process.cpuUsage();
            this.io.emit('stats', {
                uptime: `${Math.floor(process.uptime() / 60)}:${Math.floor(process.uptime() % 60).toString().padStart(2, '0')}`,
                memoryUsage: `${((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100).toFixed(2)}%`,
                cpuUsage: `${((cpuUsage.user + cpuUsage.system) / (process.uptime() * 1e6) * 100).toFixed(2)}%`,
                platform: process.platform,
                arch: process.arch
            });
        }, 2000)

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
    public async debug({message}: { message: string }) {
        await this.logs.logCustom({ type: 'DEBUG', message: message });
        console.log('DEBUG log registrado:', message);
        // Envía el evento al front
        this.io.emit('log', { message, type: 'DEBUG' });
    }

    /**
     * Registra un log de tipo INFO usando logCustom
     */
    public async info({message}: { message: string }) {
        await this.logs.logCustom({ type: 'INFO', message: message });
        console.log('INFO log registrado:', message);
        // Envía el evento al front
        this.io.emit('log', { message, type: 'INFO' });
    }

    /**
     * Registra un log de tipo WARNING usando logCustom
     */
    public async warning({message}: { message: string }) {
        await this.logs.logCustom({ type: 'WARNING', message: message });
        console.log('WARNING log registrado:', message);
        // Envía el evento al front
        this.io.emit('log', { message, type: 'WARNING' });
    }

    /**
     * Registra un log de tipo ERROR usando logCustom
     */
    public async error({message}: { message: string }) {
        await this.logs.logCustom({ type: 'ERROR', message: message });
        console.log('ERROR log registrado:', message);
        // Envía el evento al front
        this.io.emit('log', { message, type: 'ERROR' });
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