import { FieldPacket, RowDataPacket } from "mysql2";
import { Captcha } from "../core/types";
import { deleteImage } from "./file_service";
import { PoolConnection } from "mysql2/promise";
import { getConnection } from "./database_service";

export const removeUnused = async () => {
    let db: PoolConnection | null = null;

    try {
        db = await getConnection();

        let [rows] = await db.execute("SELECT * FROM `images` WHERE `time` < (NOW() - INTERVAL 3 MINUTE)") as unknown as [RowDataPacket[], FieldPacket[]];

        if (rows.length === 0) return;
        
        for (let row of rows as Captcha[]) {
            try {
                await deleteImage(row.file_name);
            } catch (error) {
                console.error('Error deleting image: ', error);
            }
        }

        await db.execute("DELETE FROM `images` WHERE `time` < (NOW() - INTERVAL 3 MINUTE)");
    } catch (error) {
        console.error(error);
    } finally {
        db?.release();
    }
}