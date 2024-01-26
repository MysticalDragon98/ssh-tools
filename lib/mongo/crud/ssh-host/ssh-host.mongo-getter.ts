import { SshHostModel, SshHost } from "../../models/ssh-host.mongo-model";

export async function getSshHost (sshHostId: string | SshHost) {
    if (sshHostId.constructor.name === "model") {
        return sshHostId as SshHost;
    }

    return await SshHostModel.findOne({
        name: sshHostId
    });
}