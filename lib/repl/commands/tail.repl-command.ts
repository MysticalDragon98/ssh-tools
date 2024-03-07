import { ok } from "assert";
import { CurrentSSHHost } from "../../classes/CurrentSSHHost.class";
import waitKey from "../../modules/input/waitKey";

interface IOptions {

}

export default async function tailREPLCommand (args: string[], options: IOptions) {
    const [ service ] = args;
    ok(service, "Usage `tail <service>`");
    const stream = await CurrentSSHHost.exec(`tail -f /var/log/${service}.log`, {});

    stream.pipe(process.stdout);

    await new Promise<void>((resolve, reject) => {
        waitKey("q").then(async () => {
            await CurrentSSHHost.disconnect();
            resolve();
        });
        stream.on("error", reject);
        stream.on("close", resolve);
    });

}