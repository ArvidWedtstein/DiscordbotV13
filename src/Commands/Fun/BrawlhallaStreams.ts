import { Command } from '../../Interfaces';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, Interaction, MessageAttachment } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import { Stream, TwitchUser } from '../../Functions/BrawlhallaStream';
import profileSchema from '../../schemas/profileSchema';
import axios from 'axios';
import moment from 'moment';


export const command: Command = {
  name: "brawlhallastreams",
  description: "get brawlhalla's upcomming streams",
  aliases: ["brawlhallatwitchstreams"],
  hidden: false,
  UserPermissions: ["SEND_MESSAGES"],
  ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
  ownerOnly: false,
  examples: ["brawlhallastreams"],
  
  run: async(client, message, args) => {
    const { channel, author, guild, mentions } = message;

    if (!guild) return;

    let streams: Stream[] = [];
    try {
            
      let { data: streamdata } = await axios.get(`https://api.twitch.tv/helix/schedule?broadcaster_id=75346877`, {
        headers: {
          'Authorization': `Bearer ${process.env.TWITCH_ACCESS_TOKEN}`,
          'Client-ID': process.env.TWITCH_CLIENT_ID || '',
        }
      });

      streams = streamdata.data.segments;
    } catch (err) {
      console.log(err)
    }
  
    // Calculate the stream duration
    const getStreamDuration = ((daStream: Stream) => {
      let streamDuration = moment.duration(moment(daStream.end_time).diff(moment(daStream.start_time)));
      let streamDurationString: any = streamDuration.asHours().toFixed(1);
      streamDurationString = `*${streamDurationString}h*`;
      return streamDurationString
    });

    // Calculate the amount of points the user can earn while watching the stream.
    const calculatePoints = ((daStream: Stream) => {
      let streamDuration = moment.duration(moment(daStream.end_time).diff(moment(daStream.start_time)));
      let streamPoints = parseInt(streamDuration.asMinutes().toFixed(1));
      return streamPoints
    });


    // Create new MessageAttachment for the border at the bottom of the embed.
    const attachment = new MessageAttachment('./img/banner.gif', 'banner.gif');
    
    let streamString = streams.map((stream: Stream) => {
      const { title, start_time, end_time, is_recurring, category } = stream;
      if (moment(stream.start_time).isBefore(moment())) return;

      return `*${moment(start_time).format('DD.MM, HH:mm')}* - ${getStreamDuration(stream)} **${title}**`
    });
    
    let embed = new MessageEmbed()
      .setColor(client.config.botEmbedHex)
      .setTitle(`Brawlhalla's Upcoming Streams`)
      .setURL('https://www.twitch.tv/brawlhalla')
      .setDescription(streamString.join('\n'))
      .setThumbnail('https://static-cdn.jtvnw.net/jtv_user_pictures/501d25e0-fa79-4fb0-b9d5-c60797608823-profile_image-300x300.png')
      .setImage('attachment://banner.gif')
      .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
      .setTimestamp()

    channel.send({ embeds: [embed], files: [attachment] })
  }
}
