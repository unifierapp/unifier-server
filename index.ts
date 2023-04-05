import app from "@/server";
import * as config from "@/config"
import {errorHandling} from "@/utils/middlewares";



async function run() {
    app.listen(config.PORT, () => {
        console.log(`Listening to port ${process.env.PORT}`)
    });
}

run();