export interface QueryType {
    insertCaptcha(text: string): Promise<void>;
}