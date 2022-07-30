import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, Interaction, MessageAttachment } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import { addXP } from '../../Functions/Level';
import profileSchema from '../../schemas/profileSchema';
import { ErrorEmbed } from '../../Functions/ErrorEmbed';
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


        // Make sure code doesn't get left in chat for everyone to read.
        message.delete();


        const capWords = (arr: any) => {
            return arr.map((el: any) => {
              return el.toLowerCase().charAt(0).toUpperCase() + el.toLowerCase().slice(1).toLowerCase();
            });
        }

        let codeRegex = new RegExp(/[a-zA-Z0-9]{6}-[a-zA-Z0-9]{6}/g);
        let code = args[0];
        if (!code || !codeRegex.test(code)) return ErrorEmbed(message, client, command, `Invalid Code | ABCDEF-GHIJKL {Name}`);

        args.shift()

        if (args.join(' ').length < 1) return ErrorEmbed(message, client, command, `Name is not long enough`);

        const check = await profileSchema.findOne({
            userId: author.id,
            guildId: guild.id
        })

        if (check.brawlhallacodes.find((x:any) => x.code === code)) return ErrorEmbed(message, client, command, `That code already exists`);
        
        let brawlhallacodes = {
            code: code,
            name: capWords(args).join(' '),
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

        return channel.send('Added your brawlhalla code!')
    }
}
