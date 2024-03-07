import { compile } from "handlebars";


export default function parseHandlebarsTemplate (template: string, data: any) {
    const handlebars = compile(template);

    return handlebars(data);
}
