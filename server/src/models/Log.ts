import { Database } from "sqlite";
import { Log, LogType, HttpMethod } from "@common/types";
import { types, methods } from "@common/consts";


export default class LogManager {
    static types = types
    static methods = methods
    private db: Database

    public static async createModel(db: Database) {
        await db.run(`
            DROP TABLE IF EXISTS log;
            DROP TABLE IF EXISTS log_type;
            DROP TABLE IF EXISTS http_method;
        `)

        await db.run(`
            CREATE TABLE IF NOT EXISTS log_type (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            )
        `);

        const typeStatement = await db.prepare("INSERT OR IGNORE INTO log_type (name) VALUES (?)")
        for (const logType of LogManager.types) 
            await typeStatement.run(logType);
        
        await db.run(`
            CREATE TABLE IF NOT EXISTS http_method (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            )
        `);

        const methodStament = await db.prepare("INSERT OR IGNORE INTO http_method (name) VALUES (?)")
        for (const method of LogManager.methods) 
            await methodStament.run(method)

        await db.run(`
            CREATE TABLE IF NOT EXISTS log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type_id INTEGER NOT NULL,
                method_id INTEGER NOT NULL,
                ip TEXT NOT NULL,
                endpoint TEXT NOT NULL,
                body TEXT,
                params TEXT,
                FOREIGN KEY (type_id) REFERENCES log_type (id),
                FOREIGN KEY (method_id) REFERENCES http_method (id)
            );
        `);
    }

    public constructor(db: Database) {
        this.db = db
    }

    public async createModel() {
        return LogManager.createModel(this.db)
    }
    
    public async insertOne({ip, type, method, endpoint, body, params}: Log) {
        const typeId = LogManager.types.findIndex((logType) => logType === type) +1
        const methodId = LogManager.methods.findIndex((logMethod) => logMethod === method) +1
        await this.db.run(
            'INSERT INTO log (ip, endpoint, type_id, method_id, body, params) VALUES (?, ?, ?, ?, ?, ?);',
            ip, endpoint, typeId, methodId, body ? JSON.stringify(body) : null, params ? JSON.stringify(params) : null
        )
    }

    public async insertMany(logs: Log[]) {
        const statement = await this.db
            .prepare('INSERT INTO log (ip, endpoint, type_id, method_id, body, params) VALUES (?, ?, ?, ?, ?, ?);')
        
        for (const log of logs) {
            const typeId = LogManager.types.findIndex((logType) => logType === log.type) +1
            const methodId = LogManager.methods.findIndex((logMethod) => logMethod === log.method) +1
            await statement.run(log.ip, log.endpoint, typeId, methodId, log.body ? JSON.stringify(log.body) : null, log.params ? JSON.stringify(log.params) : null)
        }
    }

    public async getAll() {
        return this.db.all<Log[]>(
            // "SELECT * FROM log"
            `
            SELECT 
                log.id,
                log.ip,
                log.endpoint,
                log.body,
                log.params,
                log_type.name as type,
                http_method.name as method
            FROM log
                INNER JOIN log_type ON log.type_id = log_type.id
                INNER JOIN http_method ON log.method_id = http_method.id
        `
    );
    }
}