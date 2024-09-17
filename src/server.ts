import app from "./app";
import { SERVER_PORT } from "./core/constants";
import { removeUnused } from "./services/cron_service";
import log from "./services/logger";

setInterval(() => {
    removeUnused();
}, 240000);

app.listen(SERVER_PORT, (err?: Error) => {
    if (err) {
        log(`Failed to start the server: ${err}`);
        console.error('Failed to start the server: ', err);
    }
    console.log(`Example app listening at http://localhost:${SERVER_PORT}`);
});

