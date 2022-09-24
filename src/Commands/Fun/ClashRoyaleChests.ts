import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Interaction, ActionRowBuilder, ButtonBuilder, EmbedBuilder, GuildMember, AttachmentBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import axios from 'axios';
import APIcacheSchema from '../../schemas/24hAPIcacheSchema';
import profileSchema from '../../schemas/profileSchema';

export const command: Command = {
    name: "clashroyalechests",
    description: "Check out your upcoming chests",
    details: "Check out your upcoming chests",
    aliases: ["crchest", "crchests"],
    group: 'fun',
    hidden: false,
    UserPermissions: ["SendMessages", "EmbedLinks", "ViewChannel"],
    ClientPermissions: ["SendMessages", "AddReactions"],
    ownerOnly: false,
    examples: ["clashroyalechests {userid}"],
    run: async(client, message, args) => {
        const { guild, mentions, author, member, channel } = message;
        if (!guild) return;

        const res = await profileSchema.findOne({
            userId: author.id,
            guildId: guild.id,
            clashRoyaleId: { $exists: true, $ne: null }
        })

        if (!res || !res.clashRoyaleId) return temporaryMessage(channel, `Your profile is not connected to clash royale.\nPlease connect with -connectclashroyale`, 50)
        let userId = encodeURIComponent(res.clashRoyaleId);

        let Royale = await APIcacheSchema.findOne({
            type: "clashroyalechests",
            userId: res.userId
        })

        const getChestData = (async (ClashRoyaleUserId: string) => {
            const { data } = await axios.get(`https://api.clashroyale.com/v1/players/${ClashRoyaleUserId}/upcomingchests`, {
                proxy: {
                    protocol: 'http',
                    host: process.env.FIXIE_HOST || '',
                    port: 80,
                    auth: {
                        username: 'fixie',
                        password: process.env.FIXIE_TOKEN || ''
                    }
                },
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${process.env.CLASH_ROYALE_API_KEY}`,                        
                }
            })

            let newRoyale = await APIcacheSchema.findOneAndUpdate({
                type: "clashroyalechests",
                userId: res.userId
            }, {
                data: data
            })

            return { newRoyale, data }
        });
        
        if (!Royale) { // || moment(Royale.createdAt).isBefore(moment().startOf('day'))

            try {
                let { newRoyale, data } = await getChestData(userId);

                if (!newRoyale) {
                    newRoyale = new APIcacheSchema({
                        type: "clashroyalechests",
                        userId: res.userId,
                        data: data
                    }).save()
                }
                Royale = await newRoyale
            } catch (error) {
                message.reply('Command is currently out of service due to IP Issues. Please try again later.')
                return console.error(`Error: ${error}`)
            }
        }

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder({
                    label: "Refresh",
                    emoji: "🔄",
                    style: 2,
                    customId: "refresh"
                })
            )

        
        const embed = new EmbedBuilder()
            .setTitle(`Your upcoming chests`)
            .setColor(res.color || client.config.botEmbedHex)
            .setDescription(`${Royale.data.items.map((chest: any) => `+${chest.index} - ${chest.name}`).join("\n")}`)
            .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
            .setTimestamp()

        channel.send( {embeds: [embed], components: [row] }).then(async msg => {
            const filter = (i: Interaction) => i.user.id === author.id;

            // Create a collector for the buttons
            const collector = msg.createMessageComponentCollector({
                filter,
                max: 1,
                time: 5 * (1000 * 60)
            })

            
            collector.on('collect', async (reaction) => {
                if (!reaction) return;
                if (!reaction.isButton()) return
                if (reaction.customId !== "refresh") return;
                reaction.deferUpdate();

                row.components[0].setDisabled(true)
                
                const { newRoyale, data } = await getChestData(userId);
                
                embed.setDescription(`${data.items.map((chest: any) => `+${chest.index} - ${chest.name}`).join("\n")}`)


                msg.edit({embeds: [embed], components: [row] })
                return
            })

            // When collector has finished, then update guilds settings
            collector.on('end', async (reaction) => {
                return
            })
        })
    }
}


