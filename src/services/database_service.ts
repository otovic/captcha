import { Connection, createConnection } from "mysql2";
import { Utils } from "../utils/utils";
import { CaptchaService } from "./canvas_service";

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


    private async insertCaptcha(): Promise<string> {
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

            return captchaToken;
        } catch (error) {
            CaptchaService.deleteImage(captchaFileName);
            console.error('Error inserting the captcha: ', error);
            throw error;
        }
    }

    query() {
        return {
            insertCaptcha: () => this.insertCaptcha(),
        }
    }
}