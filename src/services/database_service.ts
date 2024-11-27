import { createPool, Pool, PoolConnection } from "mysql2/promise";
import log from "./logger";

const pool: Pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "captcha",
    waitForConnections: true,
    connectionLimit: 400,
    queueLimit: 200
});

export const getConnection = async (): Promise<PoolConnection> => {
    try {
        return await pool.getConnection();
    } catch (error) {
        log(`Error getting database connection: ${error}`);
        throw new Error('Error getting database connection');
    }
}

export const closePool = async () => {
    try {
        await pool.end();
    } catch (error) {
        log(`Error closing database pool: ${error}`);
        throw new Error('Error closing database pool');
    }
}