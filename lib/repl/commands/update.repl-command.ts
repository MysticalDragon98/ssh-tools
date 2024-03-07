import { ok } from "assert";
import { log } from "termx";
import { CurrentSSHHost } from "../../classes/CurrentSSHHost.class";

interface IOptions {
    sudo?: boolean;
}

export default async function updateREPLCommand (args: string[], options: IOptions) {
    const [ service ] = args;
    ok(service, "Usage: update <service>");
    
    const serviceFolder = `/home/services/${service}`

    log("Pulling changes...");
    await CurrentSSHHost.exec("cd git pull", { sudo: !!options.sudo, mode: "o", wait: true });
    
    log("Restarting service...");
    await CurrentSSHHost.exec("supervisorctl restart " + service, { sudo: true, mode: "o", wait: true });
    
    log("Done!");
}