import Client from '../Client';
import axios from 'axios';
import { Formatters, MessageAttachment, MessageButton, MessageEmbed } from 'discord.js';
import profileSchema from '../schemas/profileSchema';
import moment from 'moment';
import gradient from 'gradient-string';
import { GetToken, ValidateToken } from './TwitchTokenManager';

export interface Stream {
  id: string;
  start_time: string;
  end_time: string;
  title: string;
  canceled_until: string;
  category: { id: string; name: string };
  is_recurring: boolean;
}
export interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  created_at: string;
}
export const BrawlhallaStream = (async (client: Client) => {

  let lastStream: Stream = {} as Stream;

  let streams: Stream[] = [];
  let twitchuser: TwitchUser;

  let intervalID: any;

  const RunDaily = (async () => {
    let user = 'brawlhalla'
    let token = ""
    
    
    try {
      GetToken(client, async (res: any) => {
        if (!res.data.access_token) throw new Error('No token found.');
        client.config.BrawlhallaToken = res.data.access_token;
        token = res.data.access_token;

        if (user != 'brawlhalla') {
          let { data: userdata } = await axios.get(`https://api.twitch.tv/helix/users?login=${user}`, {
            headers: {
              'Authorization': `Bearer ${client.config.BrawlhallaToken}`,
              'Client-Id': process.env.TWITCH_CLIENT_ID || '',
            }
          });
          twitchuser = userdata.data[0];
        } else {
          twitchuser = {
            id: '75346877',
            login: 'brawlhalla',
            display_name: 'Brawlhalla',
            type: '',
            broadcaster_type: 'partner',
            description: 'Welcome to Brawlhalla: the free to play platform fighter with full cross-play on PlayStation, Xbox, Nintendo Switch, Steam, iOS, and Android! Check out the Stream Schedule to know when to watch: https://www.brawlhalla.com/schedule/ ',
            profile_image_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/501d25e0-fa79-4fb0-b9d5-c60797608823-profile_image-300x300.png',
            offline_image_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/92adea76-a5b9-4404-97f4-7cf296c6af63-channel_offline_image-1920x1080.jpeg',
            view_count: 32694000,
            created_at: '2014-11-16T22:23:31Z'
          }
        }
        // Get Schedule
        let { data: streamdata } = await axios.get(`https://api.twitch.tv/helix/schedule?broadcaster_id=75346877`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Client-Id': process.env.TWITCH_CLIENT_ID || '',
          }
        });
  
        streams = streamdata.data.segments;
        if (intervalID) clearInterval(intervalID);
        // streams[0].start_time = moment().format('YYYY-MM-DD HH:mm:ss'); // For Debugging
  
        CheckForStream(streams);
        intervalID = setInterval(CheckForStream, (60 * 1000), streams);
      });
    } catch (err) {
      console.error(err)
      console.log(`BrawlhallaStream Error: ${err}`)
    }
    console.log(`${gradient.instagram(`Checking for brawlhalla streams...`)}`);
    setTimeout(RunDaily, (43200 * 1000)) // Runs every 12 hours
    /* setTimeout(RunDaily, (86400 * 1000)) // Runs every 24 hours */
  })

  const CheckForStream = (async (Streams: Stream[]) => {
    const date = new Date()
    let hours = date.getHours()
    let stream = Streams[0] // Next stream

    
    const checkStreamTime = ((streamData: Stream) => {
      
      if (streamData.canceled_until) {
        if (moment(streamData.canceled_until).isAfter(moment())) return false; // Figs
      }
      if (moment(streamData.start_time).isAfter(moment().minutes(0).seconds(0).milliseconds(0).toISOString())) return false;
      if (moment(streamData.end_time).isBefore(moment())) return false; 
      // if (moment(streamData.end_time).isBefore(moment())) return checkStreamTime(streamData); // check if works
      if (moment().isBetween(streamData.start_time, streamData.end_time)) return true;
      
      return true;
    });
    
    if (!checkStreamTime(stream)) return;

    if (stream.id === lastStream.id) return console.log('Stream with same id found.');

    lastStream = stream;

    const result = await profileSchema.find({
      brawlhalla: true
    })


    // Calculate the stream duration
    const getStreamDuration = ((daStream: Stream) => {
      let streamDuration = moment.duration(moment(daStream.end_time).diff(moment(daStream.start_time)));
      let streamDurationString: any = streamDuration.asHours().toFixed(1);
      streamDurationString = `**${streamDurationString}** ${streamDurationString > 1 ? "hours" : "hour"}`;
      return streamDurationString
    });

    // Calculate the amount of points the user can earn while watching the stream.
    const calculatePoints = ((daStream: Stream) => {
      let streamDuration = moment.duration(moment(daStream.end_time).diff(moment(daStream.start_time)));
      let streamPoints = parseInt(streamDuration.asMinutes().toFixed(1));
      return streamPoints
    });

    // Ensure that the user does not recieve two notifications in case the user is subscribed to notifications on multiple servers
    const uniqueUsers = result.filter((thing, index, self) =>
      index === self.findIndex((t) => (
        t.userId === thing.userId
      ))
    )

    let greet: string;

    let greetings = [
      'Greetings',
      "Howdy!",
      "Hello there",
      "G'day"
    ]
    let greetings1 = [
      "Good Morning",
      ...greetings
    ]
    let greetings2 = [
      "Good Afternoon",
      ...greetings
    ]
    let greetings3 = [
      "Good Evening",
      ...greetings
    ]
    let getRandom = (arr: string[]) => {
      return arr[Math.floor(Math.random() * arr.length)]
    }
    if (hours < 12) {
      greet = getRandom(greetings1);
    } else if (hours >= 12 && hours <= 17) {
      greet = getRandom(greetings2);
    } else if (hours >= 17 && hours <= 24) {
      greet = getRandom(greetings3);
    }
      
    uniqueUsers.forEach(async (user) => {
      let guild = client.guilds.cache.find((g) => g.id === user.guildId)
      if (!guild) return;

      let member = guild.members.cache.find((member) => member.id === user.userId)

      let messages = [
        `I have the pleasure to inform you that **Brawlhalla** currently is streaming a INSERT_STREAM_LENGTH long \n**${stream.title}**,\nlive on Twitch.`,
        `Did you know?!? **Brawlhalla** is live! YES. You heard right! Brawlhalla is streaming a INSERT_STREAM_LENGTH long \n**${stream.title}**\nright now on twitch!`,
        `Hey, just wanted to let you know that **Brawlhalla** is currently streaming a INSERT_STREAM_LENGTH long \n**${stream.title}**.\nHave a good day 😊`,
        `Hey there fella, just wanna let ya know that **Brawlhalla** is streaming a \n**${stream.title}**.\nHave a nice one.
        This stream will last INSERT_STREAM_LENGTH`,
        `G'day mate, just wanna let ya know **Brawlhalla** is live on this twitch thingy with a fresh INSERT_STREAM_LENGTH \n**${stream.title}**.`
      ]

      // Get a random message.
      let randomMsg = getRandom(messages)
        .replaceAll('INSERT_STREAM_LENGTH', `${getStreamDuration(stream)}`);

      // Create new MessageAttachment for the border at the bottom of the embed.
      const attachment = new MessageAttachment('./img/banner.gif', 'banner.gif');
      
      let embed = new MessageEmbed()
        .setColor(client.config.botEmbedHex)
        .setTitle(`${greet}, ${member?.user.username}.`)
        .setURL('https://www.twitch.tv/brawlhalla')
        .setDescription([
          `${randomMsg}`,
          `*You can earn up to* ${calculatePoints(stream)} *points by watching this stream!*\n`,
          `Brawlhalla's next stream is a ${getStreamDuration(Streams[1])} **${Streams[1].title}**  ${moment(Streams[1].start_time).calendar()}.`
        ].join('\n'))
        .setThumbnail('https://static-cdn.jtvnw.net/jtv_user_pictures/501d25e0-fa79-4fb0-b9d5-c60797608823-profile_image-300x300.png')
        .setImage('attachment://banner.gif')
        .setFooter({ text: `Sincerely, ${client.user?.username}`, iconURL: client.user?.displayAvatarURL() })
        .setTimestamp()

      member?.send({ embeds: [embed], files: [attachment] })
    })
  })
  RunDaily()
})
