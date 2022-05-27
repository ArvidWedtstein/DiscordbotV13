import { GuildEmoji, MessageEmbed } from "discord.js";
import Client from '../Client';
import settingsSchema from "../schemas/settingsSchema"
import color, { colors, blue, yellow, red, purple } from '../icons.json';

const guildIcons: any = {}

const icons: any = color;

export default (client: Client, guild: any, emojiId: any): GuildEmoji => {
    const selectedColor = guildIcons[guild.id];
    if (!icons[selectedColor][emojiId]) {
        throw new Error(`Unknown icon ID "${emojiId}"`)
    }
    const emoji = client.emojis.cache.find((e) => e.id === icons[selectedColor][emojiId]);
    if (!emoji) throw new Error(`Unknown icon ID "${emojiId}"`)
    return emoji;     
}

export const loadColors = (async (client: Client) => {
    for (const guild of client.guilds.cache) {
        const guildId = guild[0]
        const result = await settingsSchema.findOne({
            guildId: guildId
        })
        guildIcons[guildId] = result ? result.iconcolor : 'purple'
    }
})
export const setColor = (async (guild: any, iconcolor: any) => {
    guildIcons[guild.id] = iconcolor.toLowerCase();
})
