import { FieldPacket, RowDataPacket } from "mysql2";
import { initDatabase } from "./database_service";
import { Captcha } from "../core/types";
import { deleteImage } from "./file_service";

export const removeUnused = async () => {
    try {
        let connection = await initDatabase();

        if (!connection) {
            throw new Error('Database connection not initialized');
        }

        let [rows] = await connection.execute("SELECT * FROM `images` WHERE `time` < (NOW() - INTERVAL 12 MINUTE)") as unknown as [RowDataPacket[], FieldPacket[]];

        if (rows.length === 0) return;

        for (let row of rows as Captcha[]) {
            await deleteImage(row.file_name);
        }

        await connection.execute("DELETE FROM `images` WHERE `time` < (NOW() - INTERVAL 12 MINUTE)");
    } catch (error) {
        console.error(error);
    }
}