import sqlite3 from "sqlite3";
import { open, Database } from 'sqlite'
import { response } from "express";

export const openDatabase = (filename: string): Promise<Database<sqlite3.Database, sqlite3.Statement>> => {
    return open({
        filename,
        driver: sqlite3.Database
    })
}

    