import { config } from "dotenv";
import { ok } from "assert";

config();

ok(process.env.MONGO_URI, 'Missing required environment variable: MONGO_URI');
export const $MONGO_URI = process.env.MONGO_URI;
