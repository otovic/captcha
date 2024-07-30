import app from "./app";
import { SERVER_PORT } from "./core/constants";
import { removeUnused } from "./services/cron_service";

setInterval(() => {
    removeUnused();
}, 4000);

app.listen(SERVER_PORT, () => {
    console.log(`Example app listening at http://localhost:${SERVER_PORT}`);
});