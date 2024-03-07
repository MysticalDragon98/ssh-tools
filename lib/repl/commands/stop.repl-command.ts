import { ok } from "assert";
import { CurrentSSHHost } from "../../classes/CurrentSSHHost.class";
import { log } from "termx";

interface IOptions {

}

export default async function stopREPLCommand (args: string[], options: IOptions) {
    const [ serviceName ] = args;

    ok(serviceName, "Usage: stop <service-name>");

    await CurrentSSHHost.exec(`supervisorctl stop ${serviceName}`, {
        sudo: true,
        mode: "o",
        wait: true
    });

    log("Service", serviceName, "stopped.")
}