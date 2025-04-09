import sqlite3 from "sqlite3";
import { open, Database } from 'sqlite'
import { readdir, opendir, writeFile, readFile, copyFile } from 'node:fs/promises'

export const openDatabase = (filename: string): Promise<Database<sqlite3.Database, sqlite3.Statement>> => {
    return open({
        filename,
        driver: sqlite3.Database
    })
}

export const openSnapshot = (name: string) => {
    return open({
        filename: `./static/snapshots/${name}`,
        driver: sqlite3.Database
    })
}

export const createSnapshot = async () => {
    const date = new Date()
    const snapshotName = `snapshot-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.sqlite`;
    await copyFile('./static/db.sqlite', `./static/snapshots/${snapshotName}`)
    return snapshotName
}

export const loadSnapshot = async (name: string) => {
    const db = await openDatabase('./static/db.sqlite')
    const snapshot = await openSnapshot(name)
    const tables = await snapshot.all('SELECT name FROM sqlite_master WHERE type="table"')
    for (const table of tables) {
        const rows = await snapshot.all(`SELECT * FROM ${table.name}`)
        for (const row of rows) {
            const columns = Object.keys(row).map((col) => `"${col}"`).join(', ')
            const values = Object.values(row).map((val) => `"${val}"`).join(', ')
            await db.run(`INSERT INTO ${table.name} (${columns}) VALUES (${values})`)
        }
    }
    await db.close()
    await snapshot.close()
}

export const getSnapshots = async () => {
    const snapshots: string[] = []
    const dir = await opendir('./static/snapshots')
    for await (const dirent of dir) {
        if (dirent.isFile()) 
            snapshots.push(dirent.name)
        
    }
    return snapshots.reverse()
}