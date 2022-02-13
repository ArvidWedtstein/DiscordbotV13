import { Guild } from "discord.js";

export interface Config {
    token: any;
    mongoURI: any;
    prefix: any;
    botEmbedHex: any;
    testServer: string;
    invite?: string;
    owner?: string;
}