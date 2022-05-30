import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, ContextMenuInteraction, MessageEmbed } from "discord.js";
import moment from "moment";
import { getCoins, getColor } from "../../Functions/economy";
import { getLevel, getXP } from "../../Functions/Level";
import { SlashCommand } from '../../Interfaces';
import profileSchema from "../../schemas/profileSchema";
export const slashCommand: SlashCommand = {
    name: "profile",
    description: "get the profile of a user",
    type: "CHAT_INPUT",
    permissions: ["ADMINISTRATOR"],
    options: [
        {
            name: "user",
            type: "USER",
            description: "user you want to get profile of",
            required: false
        }  
    ],
    testOnly: true,
    run: async (client: any, interaction) => {
        if (!interaction.isCommand()) return
        await interaction.deferReply({ ephemeral: true })

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
            joinedDate = moment(results.joinedAt).fromNow()
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



        
        let embed = new MessageEmbed()
            .setColor(color)
            .setAuthor({name: `${user?.user.username}'s Profile`})
            //.addField('Joined Discord: ', user.createdAt)
        if (birthday) embed.addField('Birthday🎂: ', birthday, true)
        if (Coins) embed.addField(`ErlingCoin${Coins === 1 ? '' : 's'}${erlingcoin}: `, `\`${Coins}\`.`)
        if (userlevel && userlevel != null) embed.addField('Level:', `\`${userlevel}\``, true)
        if (xp) embed.addField('XP: ', `\`${xp.toString()}\``, true)
        if (xptonextlevel) embed.addField('XP To Next Level: ', (xptonextlevel - xp).toString(), true)
        if (messages) embed.addField("Messages Sent: ", `\`${messages}\`.`)
        if (warntxt) embed.addField("Warns: ", warntxt)
        if (joinedDate) embed.addField("Joined this server: ", `${joinedDate}.`)
        
        
        //.addField("Roles" , rolemap)
        let messageEmbed = await interaction.editReply({ embeds: [embed] });
        
    }
    
}