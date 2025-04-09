import { openDatabase, getSnapshots, createSnapshot } from '@/services/db'
import LogManager from '@/models/Log'


const db = await openDatabase('./static/db.sqlite')
await LogManager.createModel(db)

const logs = new LogManager(db)
await logs.insertMany([
    {ip: "192.168.0.1", endpoint: "/api/test", method: "GET", type: "DEBUG"},
    {ip: "192.168.0.1", endpoint: "/api/test/user", method: "POST", type: "DEBUG", body: { username: "TEST_USER", password: "12345678" }},
    {ip: "192.168.0.2", endpoint: "/api/test/user", method: "GET", type: "DEBUG", params: { username: "TEST_USER"}},
])
const results = await logs.getAll()
console.log(results)

setTimeout(async () => {
    const snapshot = await createSnapshot()
    console.log(snapshot)
}, 1000)