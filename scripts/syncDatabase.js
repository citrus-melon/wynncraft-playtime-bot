import database from "../src/database/database.js";

await database.sync(process.argv[2] ? JSON.parse(process.argv[2]): undefined);