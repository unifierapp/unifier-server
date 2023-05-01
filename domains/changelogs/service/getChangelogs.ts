import {promises as fs} from "fs";
import * as path from "path";

export default async function getChangelogs() {
    const files = await fs.readdir("./changelogs");
    files.sort((x, y) => {
        return +y.split(".")[0] - +x.split(".")[0];
    });
    return await Promise.all(files.map(async file => {
        return (await fs.readFile(path.join("./changelogs", file))).toString("utf8");
    }));
}