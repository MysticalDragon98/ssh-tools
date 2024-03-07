import { CurrentSSHHost } from "../../classes/CurrentSSHHost.class";

interface IOptions {
    sudo: boolean;
}

export default async function sshPubkeyREPLCommand (args: string[], options: IOptions) {
    const result = await CurrentSSHHost.command("cat ~/.ssh/id_rsa.pub", {
        sudo: options.sudo
    });

    return result;
}