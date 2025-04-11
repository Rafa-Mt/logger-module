import { Database } from "sqlite";
import { RouteLog, LogType, HttpMethod } from "@common/types.d";
import { types, methods } from "@common/consts";
import { openDatabase, createSnapshot, loadSnapshot } from "@/services/db";

let selected_db: Database | null = null;


export default class LogManager {
    static types = types
    static methods = methods
    private db: Database

    public static async createModel(db: Database) {
        await db.run(`


            CREATE TABLE IF NOT EXISTS log_type (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            );
        `);

        const typeStatement = await db.prepare("INSERT OR IGNORE INTO log_type (name) VALUES (?)")
        for (const logType of LogManager.types) 
            await typeStatement.run(logType);
        
        await db.run(`
            CREATE TABLE IF NOT EXISTS http_method (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            );
        `);

        const methodStament = await db.prepare("INSERT OR IGNORE INTO http_method (name) VALUES (?)")
        for (const method of LogManager.methods) 
            await methodStament.run(method)

        await db.run(`
            CREATE TABLE IF NOT EXISTS route_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                method_id INTEGER NOT NULL,
                ip TEXT NOT NULL,
                endpoint TEXT NOT NULL,
                body TEXT,
                params TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (method_id) REFERENCES http_method (id)
            );
        `);
        await db.run(`
            CREATE TABLE IF NOT EXISTS custom_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type_id INTEGER NOT NULL,
                message TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (type_id) REFERENCES log_type (id)
            );
        `);
    }

    public static async create() {
        if (!selected_db) 
            selected_db = await openDatabase('./static/db.sqlite');

        return new LogManager(selected_db);
    }

    public async save() {
        await createSnapshot()
    }

    public static async load(name: string) {
        await loadSnapshot(name)
        selected_db = await openDatabase('./static/db.sqlite');
        return new LogManager(selected_db);
    }

    private constructor(db: Database) {
        this.db = db
    }

    public async createModel() {
        return LogManager.createModel(this.db)
    }
    
    public async logRoute({ip, method, endpoint, body, params}: RouteLog) {
        const methodId = LogManager.methods.findIndex((logMethod) => logMethod === method) +1
        await this.db.run(
            'INSERT INTO route_log (ip, endpoint, method_id, body, params) VALUES (?, ?, ?, ?, ?);',
            ip, endpoint, methodId, body ? JSON.stringify(body) : null, params ? JSON.stringify(params) : null
        )
    }

    public async logCustom({type, message}: {type: LogType, message: string}) {
        const typeId = LogManager.types.findIndex((logType) => logType === type) +1
        await this.db.run(
            'INSERT INTO custom_log (type_id, message) VALUES (?, ?);',
            typeId, message
        )
    }

    public async getAllRouteLogs() {
        return this.db.all<RouteLog[]>(`
            SELECT 
                log.id,
                log.ip,
                log.endpoint,
                log.body,
                log.params,
                http_method.name as method
            FROM route_log AS log
                INNER JOIN http_method ON log.method_id = http_method.id
        `);
    }


    public async getAllCustomLogs() {
        return this.db.all<LogType[]>(`
            SELECT
                log.id,
                log.message,
                log.timestamp,
                log_type.name as type   
            FROM custom_log as log
                INNER JOIN log_type ON log.type_id = log_type.id
        `);
    }
}