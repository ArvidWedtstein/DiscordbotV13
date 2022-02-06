import languageSchema from './schemas/languageSchema';
import lang, { translations } from './lang.json';
import client from './Client'
import Discord, { Client } from 'discord.js';

const guildLanguages: any = {}
const listoflang: any = translations;
//Update Languages
export async function loadLanguages (client: Client) {
    for (const guild of client?.guilds.cache) {
        const guildId = guild[0]
        const result = await languageSchema.findOne({
            guildId: guildId
        })
        guildLanguages[guildId] = result ? result.language : 'english'
    
    }
}
export async function setLanguage (guild: any, language: any) {
    guildLanguages[guild.id] = language.toLowerCase();
}


export default async function (guild: any, textId: string) {
    if (!listoflang[textId]) {
        throw new Error(`Unknown text ID "${textId}"`)
    }
    const selectedLanguage = guildLanguages[guild.id];

    return listoflang[textId][selectedLanguage]     
    
}

