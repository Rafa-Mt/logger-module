import { openDatabase, createSnapshot } from '@/services/db';
import LogManager from '@/models/Log';
import express from 'express';
import http from 'http';
import path from 'path';

export class LoggerServer {
    private db: any;
    private logs!: LogManager;

    constructor() {
        this.init();
    }

    private async init() {
        // Configuración del servidor de logs (puerto 4586)
        const app = express();
        const server = http.createServer(app);

        // Configuración del front (puerto 4590)
        const frontApp = express();
        const frontPort = 4590;

        // Sirve los archivos estáticos del front
        frontApp.use(express.static(path.join(__dirname, '../../static/front')));

        // Inicia el servidor del front
        frontApp.listen(frontPort, () => {
            console.log(`Front disponible en http://localhost:${frontPort}`);
        });

        // Configura la base de datos y el modelo de logs
        this.db = await openDatabase('./static/db.sqlite');
        await LogManager.createModel(this.db);
        this.logs = new LogManager(this.db);

        // Endpoint para obtener logs
        app.get('/logs', async (req, res) => {
            const results = await this.logs.getAll();
            res.json(results);
        });

        // Inicia el servidor de logs
        const logPort = 4586;
        server.listen(logPort, () => {
            console.log(`Servidor de logs disponible en http://localhost:${logPort}`);
        });
    }

    // Método para registrar logs de tipo DEBUG
    public async logDebug(log: { ip: string; endpoint: string; method: string; body?: any; params?: any }) {
        await this.logs.insertOne({ ...log, type: 'DEBUG' });
        console.log('DEBUG log registrado:', log);
    }

    // Método para registrar logs de tipo ERROR
    public async logError(log: { ip: string; endpoint: string; method: string; body?: any; params?: any }) {
        await this.logs.insertOne({ ...log, type: 'ERROR' });
        console.error('ERROR log registrado:', log);
    }

    // Método para crear un snapshot de los logs
    public async createSnapshot() {
        const snapshot = await createSnapshot();
        console.log('Snapshot creado:', snapshot);
        return snapshot;
    }
}