import { ok } from "assert";
import { SshHostModel } from "../../mongo/models/ssh-host.mongo-model";
import { log } from "termx";

interface IOptions {
    privKey?: string;
}

export default async function addHostREPLCommand (args: string[], options: IOptions) {
    const [ name, url ] = args;
    const { username, address, port } = /(?:(?<username>[^@]+)@)?(?<address>[^:]+)(?::(?<port>\d+))?/.exec(url).groups;

    ok(name && address, "Usage: add-host <name> <username@address:port>");

    await SshHostModel.create({
        name,
        address,
        port: Number(port ?? 22),
        username,
        privKey: options.privKey
    });

    log(`Host ${name} added!`);
}