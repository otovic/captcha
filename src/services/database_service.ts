import { Connection, createConnection } from "mysql2";

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


    private async insertCaptcha(text: string) {
        if (!this.connection) {
            console.error('Database connection not initialized');
            return;
        }

        try {
            await this.connection.execute(
                "INSERT INTO `images` (`token`, `file_name`, `time`, `code`) VALUES (?, ?, ?, ?)",
                ['asdasd', 'slika.png', 'NOW()', text]
            );
            console.log('Captcha inserted successfully');
        } catch (error) {
            console.error('Error inserting the captcha: ', error);
        }
    }

    query() {
        return {
            insertCaptcha: (text: string) => this.insertCaptcha(text),
        }
    }
}