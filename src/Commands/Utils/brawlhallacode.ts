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
    aliases: ["bwlcode", "addbrawlhallacode"],
    hidden: true,
    UserPermissions: ["ADMINISTRATOR"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS", "EMBED_LINKS"],
    ownerOnly: true,
    examples: ["brawlhallacode {code} {name}"],
    run: async(client, message, args) => {
        const { guild, channel, author } = message;
        if (!guild) return
        
        let codeRegex = new RegExp(/[a-zA-Z0-9]{6}-[a-zA-Z0-9]{6}/g);
        let code = args[0];
        if (!code || !codeRegex.test(code)) return temporaryMessage(channel, `Invalid Code | ABCDEF-GHIJKL {Name}`, 10)

        args.shift()

        if (args.join(' ').length < 1) {
            message.delete();
            return temporaryMessage(channel, `Name is not long enough`, 10)
        }

        const check = await profileSchema.findOne({
            userId: author.id,
            guildId: guild.id
        })
        if (check.brawlhallacodes.find((x:any) => x.code === code)) return temporaryMessage(channel, `Code already exists`, 10);
        
        let brawlhallacodes = {
            code: code,
            name: args.join(' '),
            redeemed: false
        }

        // $AddToSet operator adds a value to an array unless the value is already present
        const results = await profileSchema.findOneAndUpdate({
            userId: author.id,
            guildId: guild.id
        }, {
            $push: {
                brawlhallacodes
            }
        })

        // Make sure code doesn't get left in chat for everyone to read.
        message.delete();

        return channel.send('Added your brawlhalla code!')
    }
}
