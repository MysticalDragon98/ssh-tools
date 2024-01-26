//* Imports

import { ok } from "assert";
import { getSshHost } from "../../mongo/crud/ssh-host/ssh-host.mongo-getter";
import { SshHost } from "../../mongo/models/ssh-host.mongo-model";
import { Client } from "ssh2";
import { join } from "path";
import { readFile } from "fs/promises";

export default async function createSSHConnection (hostId: string | SshHost) {
    const host = await getSshHost(hostId);
    ok(host, `Host ${hostId} not found!`);

    const connection = new Client();
    return new Promise<Client>(async (resolve, reject) => {
        connection.on('ready', () => {
            resolve(connection);
        });
        connection.on('error', reject);
        connection.connect({
            host: host.address,
            port: host.port ?? 22,
            username: host.username ?? process.env.USER,
            privateKey: await readFile(host.privKey ?? join("/home", process.env.USER, '.ssh', 'id_rsa'))
        });
    });

}