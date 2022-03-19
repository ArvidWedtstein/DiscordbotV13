import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, ContextMenuInteraction, MessageEmbed } from "discord.js";
import { SlashCommand } from '../../Interfaces';
export const slashCommand: SlashCommand = {
    name: "gulag",
    // description: "getavatar",
    type: "USER",
    permissions: ["EMBED_LINKS"],
    // options: [
    //     {
    //         name: "test",
    //         type: "BOOLEAN",
    //         description: "test"
    //     }  
    // ],
    testOnly: true,
    run: async (client, interaction, args) => {
        // if (!interaction.isCommand()) return
        if (interaction.isCommand()) return
        if (interaction.isUserContextMenu()) {
            const member = interaction.targetMember; 
            if(member) {
                if (member?.user.id === '787324889634963486') {
                    interaction?.channel?.send('Ha! Try again bitch.')
                    setTimeout(()=>{
                        let embed = new MessageEmbed()
                            .setColor('#ff0000')
                            .setAuthor({name: `<@${interaction.member?.user.id}> was sent to gulag by ${member.user.username}`, iconURL: `${member.avatar}`, url: 'https://www.youtube.com/watch?v=DLzxrzFCyOs'})
                            .setImage("https://media.tenor.com/images/2ebdbc0be9077e4636339539c1984f58/tenor.gif")
                        let messageEmbed = interaction.channel?.send({ embeds: [embed] })
                    }, 1000);
                } else {
                    let embed = new MessageEmbed()
                        .setColor('#ff0000')
                        .setImage("https://media.tenor.com/images/2ebdbc0be9077e4636339539c1984f58/tenor.gif")
                        .setThumbnail(interaction.targetUser.displayAvatarURL())
                        .setDescription(`<@${member.user.id}> was sent to gulag by glorious leader Stalin`)
                    let messageEmbed = await interaction.editReply({embeds: [embed]});
                }
            } else {
                interaction.editReply({content: `Failed to send this user to gulag`});
            }
        }
        if (interaction.isContextMenu()) console.log('context MENU')
        //const subCommand = interaction.options.getSubcommand();
        
    }
    
}