import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, User, GuildMember, GuildListMembersOptions } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import profileSchema from '../../schemas/profileSchema';

export const command: Command = {
    name: "compare",
    description: "compare yourself to a user",
    aliases: ["memecompare"],
    group: __dirname,
    hidden: false,
    UserPermissions: ["SendMessages"],
    ClientPermissions: ["SendMessages", "AddReactions"],
    ownerOnly: false,
    examples: ["compare @user"],
    
    run: async(client, message, args) => {
        const { guild, member: Member, author: Author, mentions } = message;
        if (!guild?.available) return;
        if (!mentions.users.first()) return temporaryMessage(message.channel, `${await language(message.guild, 'BAN_NOUSERSPECIFIED')}`, 5);
        let mention = mentions.users.first();
        let mention2: any = mentions.users.last();

        function randomIntFromInterval(min: number, max: number) { // min and max included 
            return Math.floor(Math.random() * (max - min + 1) + min)
        }

        if (!mention2) mention2 = guild.members.cache.get(message.author.id)

        const User1 = guild?.members.cache.find(m => m.id === mention?.id)
        const User2 = guild?.members.cache.find(m => m.id === mention2?.id)

        const User1PPsize = randomIntFromInterval(1, 30)
        const User2PPsize = randomIntFromInterval(1, 30)
        const guildId = guild?.id;
        const resultUser = await profileSchema.findOne({
            userId: User1?.id,
            guildId
        })
        const resultUser2 = await profileSchema.findOne({
            userId: User2?.id,
            guildId
        })
        
        
        const embed = new EmbedBuilder()
            .setTitle(`${User1?.user.username} vs ${User2?.user.username}`)
            .setFooter({ text: `Requested by ${message.author.tag}`})
            .addFields(
                // {name: "**Level**", value: `${author.username}: \`\`\`css\n${resultUser.level}\`\`\`\n${member?.user.username}: \`\`\`fix\n${resultUser2.level}\`\`\``}
                {name: `**${User1?.user.username}**`, value: 
                    `Level: \`${resultUser.level}\`
                    Coins: \`${resultUser.coins}\`
                    XP: \`${resultUser.xp}\`
                    Bannable: \`${User1?.bannable}\`
                    Moderatable: \`${User1?.moderatable}\`
                    Premium: \`${User1?.premiumSince}\`
                    Highest Role: \`${User1?.roles.highest.name}\`
                    PP Size: \`${User1PPsize}cm ${User1PPsize > 20 ? '(OK PP)' : '(Smol PP)'}\`
                `, inline: true},
                {name: `**${User2?.user.username}**`, value: 
                    `Level: \`${resultUser2.level}\`
                    Coins: \`${resultUser2.coins}\`
                    XP: \`${resultUser2.xp}\`
                    Bannable: \`${User2?.bannable}\`
                    Moderatable: \`${User2?.moderatable}\`
                    Premium: \`${User2?.premiumSince}\`
                    Highest Role: \`${User2?.roles.highest.name}\`
                    PP Size: \`${User2PPsize}cm ${User2PPsize > 20 ? '(OK PP)' : '(Smol PP)'}\`
                `, inline: true}
            )
            .setTimestamp()
        message.channel.send({embeds: [embed]});
    }
}