import { ok } from "assert";
import { getSshHost } from "../mongo/crud/ssh-host/ssh-host.mongo-getter";
import { SshHost } from "../mongo/models/ssh-host.mongo-model";
import createSSHConnection from "../modules/ssh/createSSHConnection";
import { Client, SFTPWrapper } from "ssh2";
import executeSSHCommand from "../modules/ssh/executeSSHCommand";
import { log } from "termx";
import { resolve } from "path";
import parseHandlebarsTemplate from "../modules/templates/parseHandlebarsTemplate";
import { readFile } from "fs/promises";

export class CurrentSSHHost {

    static currentHost: SshHost;
    static conn: Client;
    static sftpConn: SFTPWrapper;

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

    static async sftp () {
        const conn = await this.connection();

        if (this.sftpConn) {
            return this.sftpConn;
        }
        return await new Promise<SFTPWrapper>((resolve, reject) => {
            conn.sftp((err, sftp) => {
                if (err) {
                    reject(err);
                } else {
                    this.sftpConn = sftp;
                    resolve(sftp);
                }
            });
        });
    }

    static async exec (command: string, options: { sudo?: boolean, mode?: "i" | "o" | "io", wait?: boolean }) {
        const stream = await executeSSHCommand(await this.connection(), options.sudo? "sudo " + command : command);

        if (options.mode?.includes("i"))
            process.stdin.pipe(stream);
        if (options.mode?.includes("o"))
            stream.pipe(process.stdout);

        if (options.wait) {
            await new Promise<void>((resolve, reject) => {
                stream.on("error", reject);
                stream.on("close", resolve);
            });
        }

        return stream;
    }

    static async command (command: string, options: { sudo?: boolean } = {}) {
        const stream = await this.exec(command, options);

        return await new Promise<string>((resolve, reject) => {
            let data = "";
            stream.on("data", (chunk) => { data += chunk; });
            stream.on("error", reject);
            stream.on("close", () => { resolve(data); });
        });
    }

    static async disconnect () {
        if (this.conn) {
            this.conn.end();
            this.conn = null;
        }
    }

    static async mkdir (path: string, options?: { sudo?: boolean }) {
        await this.command(`mkdir -p ${path}`, options || {});
    }

    static async put (path: string, content: string | Buffer, options: { sudo?: boolean } = {}) {
        const sftp = await this.sftp();
        
        if (options.sudo) {
            await this.command("sudo touch " + path, { sudo: true });
            await this.command("chmod 777 " + path, { sudo: true });    
        }

        log("Uploading file to " + path + "...");
        await new Promise<void>(async (resolve, reject) => {
            const ws = sftp.createWriteStream(path);

            ws.on("error", reject);
            ws.on("close", async () => {
                await this.command("chmod 700 " + path, { sudo: true });
                resolve();
            });
            ws.end(content);
        });
    }

    static async putTemplate (name: string, destination: string, data: any, options: { sudo?: boolean } = {}) {
        const templatePath = resolve(__dirname, "../file-templates/" + name);
        const content = await parseHandlebarsTemplate(await readFile(templatePath, "utf-8"), data);

        log("Putting template " + name + " to " + destination + "...");

        await this.put(destination, content, options);
    }

}