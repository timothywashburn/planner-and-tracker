import Bot from "../discordhead/bot";
import MongoManager from "./controllers/mongo-manager";
import {config} from "dotenv";
import {resolve} from "path";

console.log("starting server");

config({ path: resolve(__dirname, '../../.env') });

(async () => {
    await MongoManager.getInstance().init();
    new Bot();
})();