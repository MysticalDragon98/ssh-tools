import { ok } from "assert";
import { getSshHost } from "../../mongo/crud/ssh-host/ssh-host.mongo-getter";
import { CurrentSSHHost } from "../../classes/CurrentSSHHost.class";
import { log } from "termx";

interface IOptions {

}

export default async function useREPLCommand (args: string[], options: IOptions) {
    const [ name ] = args;
    ok(name, "Usage: use <ssh-host-name>");
    
    const host = await getSshHost(name);
    ok(host, `Host ${name} not found`);

    await CurrentSSHHost.set(host);

    log(`Switched to host ${name}.`)
}