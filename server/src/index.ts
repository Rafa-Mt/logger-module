import { openDatabase } from '@/services/db'
import LogManager from '@/models/Log'

const db = await openDatabase('./static/db.sqlite')
await LogManager.createModel(db)
const logs = new LogManager(db)
await logs.insertMany([
    {ip: "192.168.0.1", endpoint: "/api/test", method: "GET", type: "DEBUG"},
    {ip: "192.168.0.1", endpoint: "/api/test/user", method: "POST", type: "DEBUG", body: { username: "TEST_USER", password: "12345678" }},
    {ip: "192.168.0.2", endpoint: "/api/test/user", method: "GET", type: "DEBUG", params: { username: "TEST_USER"}},
])
await logs.insertOne({ip: "192.168.10.0", endpoint: "/api/how", method: "GET", type: "ERROR"})

const logResponse = await logs.getAll()
console.log(logResponse)