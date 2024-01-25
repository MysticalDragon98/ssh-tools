import IReplOptions from "./interfaces/repl-options";
import REPL from "node:repl";
import Minimist from "minimist";
import { join, resolve } from "node:path";
//* Imports

export default async function initREPL (options: IReplOptions) {
    const repl = REPL.start({
        prompt: `${options.name}> `,
        eval: async (cmd, context, filename, callback) => {
            const command = await Minimist(cmd.trim().split(" "), {});
            const [ commandName, ...commandArgs ] = command._;

            const commandPath = resolve(__dirname, "../../lib/repl/commands", `${commandName}.repl-command.ts`);
            try {
                const commandModule = await import(commandPath);
                await commandModule.default(commandArgs, command);
            } catch (error) {
                throw new Error(`Command "${commandName}" not found.`);
            }

            callback(null, undefined);
        }
    });
}