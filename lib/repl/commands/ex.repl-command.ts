import { CurrentSSHHost } from "../../classes/CurrentSSHHost.class";

interface IOptions {
    sudo?: boolean
}

export default async function exREPLCommand (args: string[], options: IOptions) {
    const stream = await CurrentSSHHost.exec(args.join(' '), {});

    stream.pipe(process.stdout);

    await new Promise((resolve, reject) => {
        stream.on("error", reject);
        stream.on("close", resolve);
    });
}