import { ok } from "assert";
import { CurrentSSHHost } from "../../classes/CurrentSSHHost.class";
import { log } from "termx";
import { getSshHost } from "../../mongo/crud/ssh-host/ssh-host.mongo-getter";

interface IOptions {

}

export default async function sshREPLCommand (args: string[], options: IOptions) {
    const name = args[0] || CurrentSSHHost.currentHost?.name;
    ok(name, "Usage: ssh <name>");

    const host = await getSshHost(name);

    let str = "ssh ";
    if (host.privKey) str += `-i ${host.privKey} `;
    if (host.username) str += `${host.username}@`;
    str += host.address;
    if (host.port && host.port !== 22) str += `:${host.port}`;

    console.log(str)
}