//* Imports

import { initDatabaseConnection } from "./plugins/mongo";
import initREPL from "./plugins/repl/initREPL";

async function main () {
    await Promise.all([
        initDatabaseConnection()  
    ]);

    //* Post Main
    await initREPL({
        name: "ssh-tools"
    })
}

main();

process.on('uncaughtException', console.log);
process.on('unhandledRejection', console.log);