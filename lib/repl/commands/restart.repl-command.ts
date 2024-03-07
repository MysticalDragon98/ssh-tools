import { ok } from "assert";
import { CurrentSSHHost } from "../../classes/CurrentSSHHost.class";
import { log } from "termx";

interface IOptions {

}

export default async function restartREPLCommand (args: string[], options: IOptions) {
    const [ serviceName ] = args;

    ok(serviceName, "Usage: restart <service-name>");

    await CurrentSSHHost.exec(`supervisorctl restart ${serviceName}`, {
        sudo: true,
        mode: "o",
        wait: true
    });

    log("Service", serviceName, "restarted.")
}