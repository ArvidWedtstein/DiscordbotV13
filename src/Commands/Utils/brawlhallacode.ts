import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, Interaction, MessageAttachment } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import { addXP } from '../../Functions/Level';
import profileSchema from '../../schemas/profileSchema';
export const command: Command = {
    name: "brawlhallacode",
    description: "Brawlhalla Code",
    details: "Brawlhalla Code",
    aliases: ["bwlcode"],
    hidden: true,
    UserPermissions: ["ADMINISTRATOR"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS", "EMBED_LINKS"],
    ownerOnly: true,
    examples: ["brawlhallacode {code} {name}"],
    run: async(client, message, args) => {
        const { guild, channel, author } = message;
        if (!guild) return

        let codeRegex = new RegExp("/\b[A-Z0-9]{6}\b/-/\b[A-Z0-9]{6}\b/");
        if (!args[0]) return temporaryMessage(channel, `Invalid Code | ABCDEF-GHIJKL {Name}`, 10)
        let code = args[0];
        args.shift()

        if (args.join(' ').length < 1) return temporaryMessage(channel, `Name is not long enough`, 10)

        let brawlcode = {
            name: args.join(' '),
            code: code
        }
        
        const results = await profileSchema.findOneAndUpdate({
            userId: author.id,
            guildId: guild.id
        }, {
            $addToSet: {
                brawlhallacodes: brawlcode
            }
        })

        // Make sure code doesn't get left in chat for everyone to read.
        message.delete();

        return channel.send('Added your brawlhalla code!')
    }
}
