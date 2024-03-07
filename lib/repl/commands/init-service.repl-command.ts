import { ok } from "assert";
import { CurrentSSHHost } from "../../classes/CurrentSSHHost.class";
import { join } from "path";
import { log } from "termx";

interface IOptions {
    ports: string;
    command: string;
    repo: string;
    setup?: string;
    path?: string;
}

export default async function initServiceREPLCommand (args: string[], options: IOptions) {
    const [ serviceName ] = args;
    const { ports, command, repo, setup } = options;

    ok(serviceName && command, "Usage: init-service <--command command> [--repo url] <service-name> [--ports <ports>]");

    const entryPointFile = `/home/services/${serviceName}.sh`;
    const serviceFolder = options.path ?? `/home/services/${serviceName}`;
    const supervisorFile = `/etc/supervisor/conf.d/${serviceName}.conf`

    if (options.repo) {
        await CurrentSSHHost.mkdir(serviceFolder);
        log("Cloning repository...");
        await CurrentSSHHost.exec(`cd ${serviceFolder} && git clone ${options.repo} .`, {
            mode: "o",
            wait: true
        });
    }

    if (setup) {
        log("Setting up the project with:", setup);
        await CurrentSSHHost.exec(`cd ${serviceFolder} && ${setup}`, {
            mode: "o",
            wait: true
        });
    }

    log("Creating entry point file...");
    await CurrentSSHHost.putTemplate("entry-point.sh", entryPointFile, {
        name: serviceName,
        ports: ports?.toString().split(",").map(p => p.trim()) ?? [],
        command
    });

    await CurrentSSHHost.putTemplate("supervisor.conf", supervisorFile, {
        name: serviceName
    }, { sudo: true });

    await CurrentSSHHost.command(`chmod +x ${entryPointFile}`);

    log("Reloading supervisor...");
    await CurrentSSHHost.command(`supervisorctl reread`, { sudo: true });
    log("Starting service...");
    await CurrentSSHHost.command(`supervisorctl update`, { sudo: true });
    log("Done!");
}