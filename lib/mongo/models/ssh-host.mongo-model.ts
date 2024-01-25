import { prop, getModelForClass } from '@typegoose/typegoose';

export class SshHost {
    @prop({ required: true, unique: true }) name: string;
    @prop({ required: true }) address: string;
    @prop({ default: 22 }) port: number;
    @prop() username?: string;
    @prop() privKey?: string;
}

export const SshHostModel = getModelForClass(SshHost);