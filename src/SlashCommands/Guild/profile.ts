import { SlashCommandBuilder } from "@discordjs/builders";
import { APIEmbedField, CommandInteraction, ContextMenuCommandInteraction, EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import moment from "moment";
import { getCoins, getColor } from "../../Functions/economy";
import { getLevel, getXP } from "../../Functions/Level";
import { SlashCommand } from '../../Interfaces';
import profileSchema from "../../schemas/profileSchema";
export const slashCommand: SlashCommand = {
    name: "profile",
    description: "get the profile of a user",
    type: ApplicationCommandType.User,
    default_member_permissions: ["Administrator"],
    name_localizations: {
        'de': "profil",
        'en-GB': "profile",
        'en-US': "t",
        'es-ES': "t",
        'fr': "t"
    },
    options: [
        {
            name: "user",
            type: 6,
            description: "user you want to get profile of",
            required: false
        }  
    ],
    testOnly: false,
    run: async (client: any, interaction) => {
        if (!interaction.isChatInputCommand()) return 


        if (!interaction.guild) return;
        const user = interaction.member;
        const userId = user?.user.id;
        const guildId = interaction.guild.id;
    
        let xptonextlevel: any = ''


        const results = await profileSchema.findOne({
            userId,
            guildId
        })

        let messages = '';
        if (!results) {
            messages = '0'
        } else if (!results.messageCount) {
            messages = '0'
        } else {
            messages = results.messageCount;
        }
        let birthday = '';

        let joinedDate: any = '';
        const birthdayresult = await profileSchema.findOne({
            userId
        })
        if (!birthdayresult) {
            birthday = 'Unknown'
            joinedDate = 'Unknown'
        } else if (birthdayresult.birthday == '1/1') {
            birthday = 'Unknown'
        } else {
            birthday = birthdayresult.birthday;
            joinedDate = moment(results.joinedAt ? results.joinedAt : results.createdAt).fromNow()
        }
        let warntxt = '';

        if (!results.warnings) {
            warntxt += 'No warns'
        } else {    
            //.addField(`Warned By ${author} for "${reason}"`, `on ${new Date(timestamp).toLocaleDateString()}`)
            for (const warning of results.warnings) {
                const { author, timestamp, reason } = warning
            
                let txt = `Warned By ${author} for "${reason}" on ${new Date(timestamp).toLocaleDateString()}\n`
                warntxt += txt
            }
        }
    
        // Get Animated ErlingCoin
        const erlingcoin = client.emojis.cache.get('853928115696828426');


        
        let Coins = await getCoins(guildId, userId);
        let xp: number = parseInt(await getXP(guildId, userId));
        let userlevel: any = await getLevel(guildId, userId);

        // Calculate xp to next level with some random math
        xptonextlevel = (userlevel / 10) * (userlevel / 10) * 210;
        let color = await getColor(guildId, userId);



        const fields: APIEmbedField[] = []
        if (birthday) fields.push({ name: 'Birthday🎂: ', value: birthday, inline: true })
        if (Coins) fields.push({ name: `ErlingCoin${Coins === 1 ? '' : 's'}${erlingcoin}: `, value: `\`${Coins}\`.` })
        if (userlevel && userlevel != null) fields.push({ name: 'Level:', value: `\`${userlevel}\``, inline: true })
        if (xp) fields.push({ name: 'XP: ', value: `\`${xp.toString()}\``, inline: true })
        if (xptonextlevel) fields.push({ name: 'XP To Next Level: ', value: (xptonextlevel - xp).toString(), inline: true })
        if (messages) fields.push({ name: "Messages Sent: ", value: `\`${messages}\`.` })
        if (warntxt) fields.push({ name: "Warns: ", value: warntxt })
        if (joinedDate) fields.push({ name: "Joined this server: ", value: `${joinedDate}.` })

        let embed = new EmbedBuilder()
            .setColor('Aqua') // color
            .setAuthor({name: `${user?.user.username}'s Profile`})
            //.addField('Joined Discord: ', user.createdAt)
        if (birthday) embed.addFields(fields)

        //.addField("Roles" , rolemap)
        await interaction.reply({ embeds: [embed] });
        
    }
}