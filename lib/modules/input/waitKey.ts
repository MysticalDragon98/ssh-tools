//* Imports
// import { createInterface } from "readline";

export default async function waitKey (key: string) {
    process.stdin.setRawMode(true);

    return new Promise<void>((resolve) => {
        process.stdin.once("data", (chunk) => {
            if (chunk.toString().trim() === key) {
                process.stdin.setRawMode(false);
                resolve();
            }
        });
    });
}