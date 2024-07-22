import { RowDataPacket } from "mysql2";

export interface QueryType {
    insertCaptcha(): Promise<CaptchaClientType>;
    validateCaptcha(token: string, code: string): Promise<{}>;
}

export interface CaptchaClientType {
    token: string;
    image: string;
}

export interface Captcha extends RowDataPacket {
    id: number;
    token: string;
    file_name: string;
    time: string;
    code: string;
}