import lang, { translations } from '../lang.json';
import client from '../Client'
import Discord, { Client, Guild } from 'discord.js';
import settingsSchema from '../schemas/settingsSchema';

const guildLanguages: any = {}
const listoflang: any = translations;
//Update Languages
export async function loadLanguages (client: Client) {
    for (const guild of client?.guilds.cache) {
        const guildId = guild[0]
        const result = await settingsSchema.findOne({
            guildId: guildId
        })
        guildLanguages[guildId] = result ? result.language : 'english'
    
    }
}
export async function setLanguage (guild: any, language: any) {
    guildLanguages[guild.id] = language.toLowerCase();
}

export function insert (guild: Guild, textId: string, insertValue: any, amount?: number, itemname?: string) {
    if (!listoflang[textId]) {
        throw new Error(`Unknown text ID "${textId}"`)
    }
    const selectedLanguage = guildLanguages[guild.id];

    let localizedText = listoflang[textId][selectedLanguage];
    localizedText.replace('{itemname}', itemname);
    localizedText.replace('{amount}', amount);
    localizedText.replace('{insert}', insertValue);
    return localizedText
}

export default function (guild: Guild, textId: string) {
    if (!listoflang[textId]) {
        throw new Error(`Unknown text ID "${textId}"`)
    }
    const selectedLanguage = guildLanguages[guild.id];

    return listoflang[textId][selectedLanguage]     
    
}

