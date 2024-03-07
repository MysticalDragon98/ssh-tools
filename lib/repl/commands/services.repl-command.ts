import { CurrentSSHHost } from "../../classes/CurrentSSHHost.class";

interface IOptions {

}

export default async function servicesREPLCommand (args: string[], options: IOptions) {
    const output = await CurrentSSHHost.command("supervisorctl status", { sudo: true });
    const lines = output.trim().split("\n");
    const services: { name: string, status: string, pid: string, uptime: string }[] = [];

    for (const line of lines) {
        const [name, status, pid, ...uptime] = line.split(/\s+/);
        services.push({ name, status, pid, uptime: uptime.join(" ") });
    }

    return services;
}