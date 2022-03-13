let twitchloop = true;
import Client from '../Client';
import TwitchAPI from 'node-twitch'
import { MessageButton, MessageEmbed } from 'discord.js';
import profileSchema from '../schemas/profileSchema';
import moment from 'moment';
import gradient from 'gradient-string';
export const brawlhalla = (async (client: Client) => {
  let lastStream: any = {
    id: "",
    started_at: ""
  }
  const twitch = new TwitchAPI({
    client_id: process.env.TWITCH_CLIENT_ID || '',
    client_secret: process.env.TWITCH_CLIENT_SECRET || ''
  })
  let IsLiveMemory = false
  
  const date = new Date()
  let hours = date.getHours()
  const Run = (async () => {
    try {
      await twitch.getStreams({ channel: "brawlhalla" }).then(async data => {
        const r = data.data[0];
        if (r === undefined) return IsLiveMemory = false
        if (r.id === lastStream.id) return
        if (r.type != "live") return IsLiveMemory = false;
        
        if (twitchloop) {
          // open('https://www.twitch.tv/brawlhalla');
          IsLiveMemory = true;
          twitchloop = false;

          const result = await profileSchema.find({
            brawlhalla: true
          })

          lastStream = r;

          var greet: string;

          if (hours < 12) {
            greet = 'Good Morning';
          } else if (hours >= 12 && hours <= 17) {
            greet = 'Good Afternoon';
          } else if (hours >= 17 && hours <= 24) {
            greet = 'Good Evening';
          }
            
          result.forEach(async (user) => {
            let guild = client.guilds.cache.find((g) => g.id === user.guildId)
            if (!guild) return;

            let member = guild.members.cache.find((member) => member.id === user.userId)

            let embed = new MessageEmbed()
              .setTitle(`${greet}, ${member?.user.username}.`)
              .setDescription(`I have the pleasure to inform you that **Brawlhalla** currently is streaming, live on Twitch.`)
              .setThumbnail(r.getThumbnailUrl({width: 800, height: 500}))
              .setFooter({ text: `Sincerely, Memebot`, iconURL: client.user?.displayAvatarURL() })
              .setTimestamp()

            member?.send({ embeds: [embed]})
          })
        }
      })
    } catch (err) {
      console.error(err);
    };
  })
  Run()
  setInterval(Run, 5 * (60 * 1000));
})