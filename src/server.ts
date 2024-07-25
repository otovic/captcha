import app from "./app";
import { SERVER_PORT } from "./core/constants";

app.listen(SERVER_PORT, () => {
    console.log(`Example app listening at http://localhost:${SERVER_PORT}`);
});