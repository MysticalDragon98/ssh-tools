import { ok } from "assert";
import { getSshHost } from "../mongo/crud/ssh-host/ssh-host.mongo-getter";
import { SshHost } from "../mongo/models/ssh-host.mongo-model";
import createSSHConnection from "../modules/ssh/createSSHConnection";
import { Client } from "ssh2";
import executeSSHCommand from "../modules/ssh/executeSSHCommand";

export class CurrentSSHHost {

    static currentHost: SshHost;
    static conn: Client;

    static async set (host: string | SshHost) {
        this.currentHost = await getSshHost(host);
    }

    static get () {
        ok(this.currentHost, "No current host set. Use `use <host-name>` to set one.");
        return this.currentHost;
    }

    static async connection () {
        if (this.conn) {
            return this.conn;
        }
        
        this.conn = await createSSHConnection(CurrentSSHHost.get());

        this.conn.on("error", (err) => {
            console.error(err);
            this.conn.end();
            this.conn = null;
        });

        this.conn.on("end", () => { this.conn = null; });

        return this.conn;
    }

    static async exec (command: string, options: { sudo?: boolean }) {
        return await executeSSHCommand(await this.connection(), "sudo " + command);
    }

    static async command (command: string) {
        const stream = await this.exec(command, {});

        return await new Promise<string>((resolve, reject) => {
            let data = "";
            stream.on("data", (chunk) => { data += chunk; });
            stream.on("error", reject);
            stream.on("close", () => { resolve(data); });
        });
    }

}