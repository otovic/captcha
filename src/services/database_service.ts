import { Connection, createConnection, FieldPacket, RowDataPacket } from "mysql2/promise";
import { Utils } from "../utils/utils";
import { CaptchaService } from "./canvas_service";
import { CaptchaClientType } from "../core/types";

export class DatabaseService {
    private connection: Connection | null = null;

    constructor() {
        this.init();
    }

    private async init() {
        try {
            console.log('Initializing database connection');
            this.connection = await createConnection({
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


    private async insertCaptcha(): Promise<CaptchaClientType> {
        if (!this.connection) {
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
            await this.connection.execute(
                "INSERT INTO `images` (`token`, `file_name`, `time`, `code`) VALUES (?, ?, ?, ?)",
                [captchaToken, captchaFileName, date, captchaCode]
            );

            return {
                token: captchaToken,
                image: captchaFileName
            }
        } catch (error) {
            CaptchaService.deleteImage(captchaFileName);
            console.error('Error inserting the captcha: ', error);
            throw error;
        }
    }

    private async validateCaptcha(token: string, code: string): Promise<{}> {
        try {
            const [rows] = await this.connection?.query("SELECT * FROM `images` WHERE `token` = ? AND `code` = ?", [token, code]) as unknown as [RowDataPacket[], FieldPacket[]];

            if (rows.length === 0) {
                throw new Error('Invalid captcha');
            }

            return { status: 200, validated: true };
        } catch (error) {
            console.error('Error validating the captcha: ', error);
            throw new Error('Error validating the captcha');
        }
    }

    query() {
        return {
            insertCaptcha: () => this.insertCaptcha(),
            validateCaptcha: (token: string, code: string) => this.validateCaptcha(token, code),
        }
    }
}