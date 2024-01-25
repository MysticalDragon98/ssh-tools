//* Imports

import initREPL from "./plugins/repl/initREPL";

async function main () {
    await Promise.all([
        initREPL({
            name: "ssh-tools"
        })
    ]);

    //* Post Main
}

main();

process.on('uncaughtException', console.log);
process.on('unhandledRejection', console.log);