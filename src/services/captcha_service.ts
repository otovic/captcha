import { Utils } from "../utils/utils";
import { CaptchaService } from "./canvas_service";
import { Captcha } from "../core/types";
import { Request, Response } from "express";
import { FieldPacket, RowDataPacket } from "mysql2";
import { deleteImage } from "./file_service";
import { PoolConnection } from "mysql2/promise";
import { getConnection } from "./database_service";


export const insertCaptcha = async (req: Request, res: Response) => {
    let db: PoolConnection | null = null;

    const captchaToken = Utils.generateToken(50);
    const [date, captchaFileName] = Utils.generateCaptchaFileName();
    const captchaCode = Utils.generateCaptchaText(8);

    try {
        await CaptchaService.generateImage(captchaFileName, captchaCode);
    } catch (error) {
        console.error('Error inserting the captcha: ', error);
        throw error;
    }

    try {
        db = await getConnection();
        await db.execute(
            "INSERT INTO `images` (`token`, `file_name`, `time`, `code`) VALUES (?, ?, ?, ?)",
            [captchaToken, captchaFileName, date, captchaCode]
        );

        res.json({
            token: captchaToken,
            image: captchaFileName
        });
    } catch (error) {
        deleteImage(captchaFileName);
        console.error('Error inserting the captcha: ', error);
        res.json({
            status: 500,
            message: "Error"
        })
    } finally {
        db?.release();
    }
}

export const validateCaptcha = async (req: Request, res: Response) => {
    let db: PoolConnection | null = null;

    try {
        const { token, code } = req.body;

        db = await getConnection();
        if (!code || !token) return res.json({ status: 500, message: "Error" });

        const [rows] = await db?.query("SELECT * FROM `images` WHERE `token` = ? AND `code` = ?", [token, code]) as unknown as [RowDataPacket[], FieldPacket[]];

        if (rows.length === 0) {
            await deleteCaptcha(token);
            throw new Error('Invalid captcha');
        }

        try {
            await deleteCaptcha(token);
        } catch (error) {
            console.log("Captcha validated but failed to delete image: ", error);
        }

        return res.json({ status: 200, validated: true });
    } catch (error) {
        console.error('Error validating the captcha: ', error);
        return res.json({
            status: 500,
            validated: false
        })
    } finally {
        db?.release();
    }
}

export const deleteCaptcha = async (token: string) => {
    let db: PoolConnection | null = null;

    try {
        console.log("Deleting captcha with token: ", token);
        db = await getConnection();
        const [rows] = await db?.query("SELECT * FROM `images` WHERE `token` = ?", [token]) as unknown as [RowDataPacket[], FieldPacket[]];

        if (rows.length === 0) throw new Error("invalid captcha token");

        try {
            const captcha = rows[0] as Captcha;

            await deleteImage(captcha.file_name);
            await db?.query("DELETE FROM `images` WHERE `token` = ?", [token]);
        } catch (error) {
            console.log("Error deleting captcha image: ", error);
        }
    }
    catch (error) {
        console.log("Error deleting captcha from database", error);
    } finally {
        db?.release();
    }
}