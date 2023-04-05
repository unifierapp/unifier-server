import app from "@/server";
import * as process from "process";
import * as config from "@/config"

app.listen(config.PORT, () => {
    console.log(`Listening to port ${process.env.PORT}`)
});