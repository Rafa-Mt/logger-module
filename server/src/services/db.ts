import sqlite3 from "sqlite3";
import { open, Database } from 'sqlite'
import { opendir, copyFile, rm } from 'node:fs/promises'

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
    await rm('./static/db.sqlite');
    await copyFile(`./static/snapshots/${name}`, './static/db.sqlite')
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