//* Imports

import { Client, ClientChannel } from "ssh2";

export default async function executeSSHCommand (conn: Client, command: string) {
    return new Promise<ClientChannel>((resolve, reject) => {
        conn.exec(command, (err, stream) => {
            if (err) return reject(err);

            resolve(stream);
        });
    })
}