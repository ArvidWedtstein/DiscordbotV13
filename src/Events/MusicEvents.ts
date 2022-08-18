import { Event } from '../Interfaces';
import * as gradient from 'gradient-string';
import icon from '../Functions/icon';
import { Formatters, Interaction, MessageAttachment, MessageButton, MessageEmbed, ExcludeEnum, MessageActionRow, Message } from 'discord.js';
import { MessageButtonStyles } from 'discord.js/typings/enums';
import { QueueRepeatMode } from 'discord-player';

export const event: Event = {
    name: "ready",
    run: async (client) => {


        const getEmoji = (emojiName: string) => client.emojis.cache.find((emoji) => emoji.name === emojiName);
        client.player.on("error", (queue, error) => {
            console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
        });
        client.player.on("connectionError", (queue, error) => {
            console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
        });
        
        client.player.on("trackStart", (queue, track) => {
            const { metadata }: any = queue
            const attachment = new MessageAttachment('./img/banner.jpg', 'banner.jpg');

            function genButton(id: string, emoji: any, style: ExcludeEnum<typeof MessageButtonStyles, "LINK">) {
                return new MessageButton({
                    customId: id,
                    emoji: emoji,
                    style: style
                })
            }

            function row(playing: boolean, repeatMode: QueueRepeatMode) {
                // TODO - Add button that opens modal to add new song to the list.
                const upperRow = new MessageActionRow().addComponents(
                    genButton(`volumedown`, "🔉", "SECONDARY"),
                    genButton(`back`, icon(client, queue.guild, 'chevronleft').id, "SECONDARY"),
                    genButton(!playing ? 'play' : 'pause', icon(client, queue.guild, !playing ? 'play' : 'pause').id, "SECONDARY"),
                    genButton(`skip`, icon(client, queue.guild, 'chevronright').id, "SECONDARY"),
                    genButton(`volumeup`, "🔊", "SECONDARY")
                )
                const lowerRow = new MessageActionRow().addComponents(
                    genButton('shuffle', icon(client, queue.guild, 'shuffle').id, "SECONDARY"),
                    genButton('loopone', icon(client, queue.guild, 'loopall').id, "SECONDARY"),
                    genButton('stop', getEmoji('stop'), "SECONDARY"),
                    repeatMode === 0 ? genButton('loopstop', icon(client, queue.guild, 'loopstop').id, "SECONDARY") :
                    genButton('loopall', icon(client, queue.guild, 'loopall').id, "SECONDARY"),
                    genButton('clear', "🗑", "SECONDARY")
                )
                return [upperRow, lowerRow];
            }

            const embed = new MessageEmbed()
                .setColor(client.config.botEmbedHex)
                .setAuthor({ name: `NOW PLAYING`, iconURL: track.requestedBy.displayAvatarURL({ dynamic: true })})
                .setDescription(`${getEmoji('RGB_sheep')} [${Formatters.inlineCode(track.title)}](${track.url})\n`)
                .addFields([
                    { name: `🤡 Requested By`, value: `${track.requestedBy}`, inline: true },
                    { name: `${icon(client, queue.guild, 'audiowave')} Song By`, value: `\`${track.author}\``, inline: true },
                    { name: `${getEmoji('time')} Duration`, value: `\`> ${track.duration}\``, inline: true }
                ])
                .setImage('attachment://banner.jpg')
                .setThumbnail(track.thumbnail)
            metadata.channel.send({ embeds: [embed], files: [attachment], components: row(queue.playing, queue.repeatMode) }).then(async (msg: Message) => {
                const filter = (i: Interaction) => i.user.id === track.requestedBy.id;
                let collect = msg.createMessageComponentCollector({
                    filter, 
                    time: track.durationMS
                });
                
                // queue.setFilters({
                //     earrape: true,
                //     "8D": true,
                //     vaporwave: true,
                //     bassboost: true,
                // })

                // var intervalId = setInterval(function(){
                //     if (!queue.playing) clearInterval(intervalId);
                //     let progress = queue.createProgressBar({
                //         indicator: ".",
                //         line: "|",
                //         timecodes: true,
                //         // length: 10
                //     })
                //     embed.setDescription(`${getEmoji('RGB_sheep')} [${Formatters.inlineCode(track.title)}](${track.url})\n\n${progress}\n`)
                //     msg.edit({ embeds: [embed] });
                // }, 5000);
                let paused = false;
                collect.on('collect', async (reaction) => {
                    if (!reaction) return;
                    if (!reaction.isButton()) return;
                    reaction.deferUpdate();
                    
                    switch (reaction.customId) {
                        case "volumedown": 
                            queue.setVolume(queue.volume - 10);
                            console.log(await queue.volume)
                            break;
                        case "volumeup":
                            queue.setVolume(queue.volume + 10);
                            console.log(await queue.volume)
                            break;
                        case "back":
                            if (queue.previousTracks.length > 0) queue.back();
                            
                            break;
                        case "skip":
                            if (queue.tracks.length > 0) {
                                queue.skip();
                                embed.setDescription(`Skipped to: ${queue.current.title}`)
                                msg.edit({ embeds: [embed], files: [attachment] })
                            }
                            break;
                        case "play":
                            queue.setPaused(false);
                            paused = false
                            embed.setDescription(`**[${queue.current.title}]** has been resumed!`)
                            await msg.edit({ embeds: [embed], components: row(!paused, queue.repeatMode) })
                            break;
                        case "pause":
                            queue.setPaused(true);
                            paused = true
                            embed.setDescription(`**[${queue.current.title}]** has been paused!`)
                            await msg.edit({ embeds: [embed], components: row(!paused, queue.repeatMode) })
                            break;
                        case "stop":
                            queue.stop();
                            msg.components.every(x => x.components.every(y => y.setDisabled(true)));
                            msg.edit({ components: [...msg.components] })
                            break;
                        case "loopone":
                            queue.setRepeatMode(2); // loop all
                            msg.edit({ embeds: [embed], components: row(queue.playing, queue.repeatMode) })
                            break;
                        case "loopall":
                            queue.setRepeatMode(0); // stop
                            msg.edit({ embeds: [embed], components: row(queue.playing, queue.repeatMode) })
                            break;
                        case "loopstop":
                            queue.setRepeatMode(1); // loop one
                            msg.edit({ embeds: [embed], components: row(queue.playing, queue.repeatMode) })
                            break;
                        case "shuffle": 
                            queue.shuffle()
                            break;
                        case "clear": 
                            queue.clear();
                            msg.edit({ embeds: [embed], components: row(queue.playing, queue.repeatMode) })
                            break;
                    }
                    // return
                })
                collect.on('end', (collector) => {
                    msg.components.every(x => x.components.every(y => y.setDisabled(true)));
                    msg.edit({ components: [...msg.components] })
                })
            })
            return
        });
        
        client.player.on("trackAdd", (queue, track) => {
            const { metadata }: any = queue
            console.log('trackAdd')

            const embed = new MessageEmbed()
                .setColor(client.config.botEmbedHex)
                .setAuthor({ name: `ADDED TO QUEUE`, iconURL: track.requestedBy.displayAvatarURL({ dynamic: true })})
                .setDescription([
                    `${icon(client, queue.guild, 'musicalnotes')} [${Formatters.inlineCode(track.title)}](${track.url})\n`,
                    `Added by: ${track.requestedBy} | Duration: \`> ${track.duration}\` | Position In Queue: \`${queue.getTrackPosition(track)}\``
                ].join('\n'))
            metadata.channel.send({ embeds: [embed] });
        });
        
        client.player.on("botDisconnect", (queue) => {
            console.log('botDisconnect')
            const { metadata }: any = queue
            metadata.channel.send("❌ | I was manually disconnected from the voice channel, clearing queue!");
        });
        
        client.player.on("channelEmpty", (queue) => {
            console.log('channelEmpty')
            const { metadata }: any = queue
            metadata.channel.send("❌ | Nobody is in the voice channel, leaving...");
        });
        
        client.player.on("queueEnd", (queue) => {
            const { metadata }: any = queue
            metadata.channel.send("✅ | Queue finished!");

            setTimeout(() => {
                queue.destroy(true)
            }, 10000)
        });

    }
}