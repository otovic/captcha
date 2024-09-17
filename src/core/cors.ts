import { log } from "console";
import { ALLOWED_ORIGINS } from "./constants";

export const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        log('Origin: ', origin);
        if (!origin && ALLOWED_ORIGINS.indexOf(origin!) === -1) {
            callback(null, true);
        } else {
            log('Origin: ', origin);
            callback(new Error('Not allowed by CORS'));
        }
    }
};