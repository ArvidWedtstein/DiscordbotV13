import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import language, { insert } from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import icon from '../../Functions/icon';
import { ErrorEmbed } from '../../Functions/ErrorEmbed';
import profileSchema from '../../schemas/profileSchema';
export const command: Command = {
    name: "givebrawlhallacode",
    description: "give a brawlhalla reward to a user",
    details: "give a brawlhalla code to a user",
    aliases: ["givebwlcode"],
    group: "Inventory",
    hidden: false,
    UserPermissions: ["ReadMessageHistory", "SendMessages"],
    ClientPermissions: ["SendMessages", "AddReactions"],
    ownerOnly: false,
    examples: ["givebrawlhallacode <@user> <rewardname>"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions, content, attachments } = message;
        
        if (!guild) return
        const guildId = guild.id;
        const user = guild.members.cache.find(m => m.id == mentions.users.first()?.id || m.id == author.id)
        if (!user || user.user.bot) return ErrorEmbed(message, client, command, `${language(guild, 'VALID_USER')}`);

        const { id: userId } = user;  
        const { id: authorId } = author;
        args.shift()
        const itemname = args[0].toLowerCase();
        const amount: any = args[1];
        if (isNaN(amount)) return ErrorEmbed(message, client, command, `${language(guild, 'NaN')}`);


        // Get the users profile from the database
        let results = await profileSchema.findOne({
            userId: authorId,
            guildId: guildId,
            brawlhallacodes: { $exists: true, $ne: [] }
        });

        if (!results || !results.brawlhallacodes) return ErrorEmbed(message, client, command, `You do not have any brawlhalla codes`);
        
        const groupData = (d: any) => {
            let g = Object.entries(d.reduce((r: any, c: any) => (r[c.name]=[...r[c.name]||[], c],r), {}))
            return g.reduce((r: any, c: any) => (
                r.push({name: c[0], items: c[1]}), r), []);
        }


        // Get only the codes that are not already redeemed.
        let codes = results.brawlhallacodes.filter((unfilteredcodes: any) => unfilteredcodes.redeemed == false);

        let groupedCodes = groupData(codes);
        
        if (!groupedCodes.some((c: any) => c.name.toLowerCase() == itemname.toLowerCase())) return ErrorEmbed(message, client, command, `${language(guild, 'ADDITEM_NOEXIST')} again.`);

        let chosenCodes = groupedCodes.find((c: any) => c.name.toLowerCase() == itemname.toLowerCase());
        
        if (chosenCodes.items.length < amount) return ErrorEmbed(message, client, command, `You do not have enough ${itemname} codes`);
        
        // Remove item from senders inventory
        for (let i = 0; i < amount; i++) {
            const result = await profileSchema.findOneAndUpdate({
                guildId,
                userId: authorId,
            }, {
                $pull: {
                    brawlhallacodes: chosenCodes.items[i]
                }
            }, {
                upsert: true,
            }).catch((err: any) => {
                console.log(err)
            })
        }
        
        // Add item to receivers inventory
        const result = await profileSchema.findOneAndUpdate({
            guildId,
            userId: userId,
        }, {
            $push: {
                brawlhallacodes: { $each: chosenCodes.items.slice(0, amount) }
            }
        }, {
            upsert: true,
        }).catch((err: any) => {
            console.log(err)
        })

        // TODO: Make rewardname optional and let user select reward from select menu

        const embed = new EmbedBuilder()
            .setColor(client.config.botEmbedHex)
            .setTitle(`𝕀𝕥𝕖𝕞 𝕥𝕣𝕒𝕟𝕤𝕗𝕖𝕣𝕣𝕖𝕕 𝕤𝕦𝕔𝕔𝕖𝕤𝕤𝕗𝕦𝕝𝕝𝕪 𝕥𝕠 ${user.user.username}`)
            .setDescription(`${insert(guild, 'INVENTORY_GIVEITEM', user.user.username, amount, itemname)}`)

        channel.send({ embeds: [embed] });

        const userEmbed = new EmbedBuilder()
            .setColor(client.config.botEmbedHex)
            .setTitle(`${language(guild, 'INVENTORY_GIFTRECIEVED')}`)
            .setDescription(`${author.username} gi𝕗𝕥𝕖𝕕 𝕪𝕠𝕦 ${amount} ${itemname} 𝕔𝕠𝕕𝕖𝕤 i𝕟 ${guild.name}`)

        if (result.brawlhalla) user.send({ embeds: [userEmbed] });
        return 
    }
}