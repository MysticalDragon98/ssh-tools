import { ok } from "assert";
import { CurrentSSHHost } from "../../classes/CurrentSSHHost.class";
import { log } from "console";

interface IOptions {

}

export default async function startREPLCommand (args: string[], options: IOptions) {
    const [ serviceName ] = args;

    ok(serviceName, "Usage: start <service-name>");

    await CurrentSSHHost.exec(`supervisorctl start ${serviceName}`, {
        sudo: true,
        mode: "o",
        wait: true
    });

    log("Service", serviceName, "started.")
}