//* Imports

export default function parseArgs (input: string) {
    const args = [];
    let match;
    // Regular expression to match arguments, respecting double quotes
    const regExp = /(?:[^\s"]+|"[^"]*")+/g;

    while (match = regExp.exec(input)) {
        // Remove double quotes from the arguments that are wrapped in them
        args.push(match[0].replace(/"/g, ''));
    }

    return args;
}