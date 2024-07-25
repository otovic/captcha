import { Connection, createConnection, FieldPacket, RowDataPacket } from "mysql2/promise";
export let connection: Connection | null;

export const initDatabase = async () => {
    try {
        console.log('Initializing database connection');
        connection = await createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'captcha'
        });
        console.log('Database connection initialized');
    } catch (error) {
        console.error('Error connecting to the database: ', error);
    }
}