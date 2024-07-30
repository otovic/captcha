import { Utils } from "../utils/utils";
import { CaptchaService } from "./canvas_service";
import { Captcha } from "../core/types";
import { Request, Response } from "express";
import { connection } from "./database_service";
import { FieldPacket, RowDataPacket } from "mysql2";
import { deleteImage } from "./file_service";


export const insertCaptcha = async (req: Request, res: Response) => {
    if (!connection) {
        throw new Error('Database connection not initialized');
    }

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
        await connection.execute(
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
    }
}

export const validateCaptcha = async (req: Request, res: Response) => {
    try {
        const { captchaToken, code } = req.body;

        if (!code || !captchaToken) return res.json({ status: 500, message: "Error" });

        const [rows] = await connection?.query("SELECT * FROM `images` WHERE `token` = ? AND `code` = ?", [captchaToken, code]) as unknown as [RowDataPacket[], FieldPacket[]];

        if (rows.length === 0) {
            await deleteCaptcha(captchaToken);
            throw new Error('Invalid captcha');
        }

        try {
            await deleteCaptcha(captchaToken);
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
    }
}

export const deleteCaptcha = async (token: string) => {
    try {
        console.log("Deleting captcha with token: ", token);
        const [rows] = await connection?.query("SELECT * FROM `images` WHERE `token` = ?", [token]) as unknown as [RowDataPacket[], FieldPacket[]];

        if (rows.length === 0) throw new Error("invalid captcha token");

        try {
            const captcha = rows[0] as Captcha;

            await deleteImage(captcha.file_name);
            await connection?.query("DELETE FROM `images` WHERE `token` = ?", [token]);
        } catch (error) {
            console.log("Error deleting captcha image: ", error);
        }
    }
    catch (error) {
        console.log("Error deleting captcha from database", error);
    }
}