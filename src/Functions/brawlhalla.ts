let twitchloop = true;
import Client from '../Client';
import TwitchAPI from 'node-twitch'
import { MessageButton, MessageEmbed } from 'discord.js';
import profileSchema from '../schemas/profileSchema';
import { EmbedType } from 'discord-api-types';
import moment from 'moment';

export const brawlhalla = (async (client: Client) => {

    const twitch = new TwitchAPI({
        client_id: process.env.TWITCH_CLIENT_ID || '',
        client_secret: process.env.TWITCH_CLIENT_SECRET || ''
    })
    let IsLiveMemory = false
    const run = async function Run() {
        try {
            await twitch.getStreams({ channel: "brawlhalla" }).then(async data => {
                const r = data.data[0];
                if (r !== undefined) {
                    if (r.type === "live") {
                        if (twitchloop) {
                            // open('https://www.twitch.tv/brawlhalla');
                            IsLiveMemory = true;
                            twitchloop = false;
                            const result = await profileSchema.find({
                                brawlhalla: true
                            })

                            console.log(result)
                            console.log(r)
                            let embed = new MessageEmbed()
                                .setTitle(`${r.title}`)
                                .setAuthor({ name: `Brawlhalla is now streaming live!`})
                                .setDescription(`Viewers: ${r.viewer_count}`)
                                .addFields(
                                    {name: "Started: ", value: `\`\`\`ini\n[${moment(r.started_at).fromNow()}]\`\`\``}
                                )
                                .setImage(r.getThumbnailUrl({width: 800, height: 500}))

                            result.forEach(async (user) => {
                                let guild = client.guilds.cache.find((g) => g.id === user.guildId)
                                if (!guild) return;

                                let member = guild.members.cache.find((member) => member.id === user.userId)
                                member?.send({ embeds: [embed]})
                            })
                        }
                        
                    } else {
                        IsLiveMemory = false;
                    }
                } else {
                    IsLiveMemory = false;
                }
                
            })
        } catch (err) {
            console.error(err);
        };
        
    }
    setInterval(run, 60 * 1000);
})