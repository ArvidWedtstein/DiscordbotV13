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
  
  
  const Run = (async () => {
    try {
      const date = new Date()
      let hours = date.getHours()

      await twitch.getStreams({ channel: "brawlhalla" }).then(async data => {
        const r = data.data[0];
        if (r === undefined) return IsLiveMemory = false
        if (r.id === lastStream.id) return
        if (r.type != "live") return IsLiveMemory = false;
        
        if (twitchloop) {
          console.info('Brawlhalla stream found');

          // open('https://www.twitch.tv/brawlhalla');
          IsLiveMemory = true;
          twitchloop = false;

          const result = await profileSchema.find({
            brawlhalla: true
          })

          lastStream = r;

          var greet: string;

          var greetings = [
            'Greetings',
            "Howdy!",
            "Hello there"
          ]
          var greetings1 = [
            "Good Morning",
            ...greetings
          ]
          var greetings2 = [
            "Good Afternoon",
            ...greetings
          ]
          var greetings3 = [
            "Good Evening",
            ...greetings
          ]

          if (hours < 12) {
            greet = greetings1[Math.floor(Math.random()*greetings1.length)];;
          } else if (hours >= 12 && hours <= 17) {
            greet = greetings2[Math.floor(Math.random()*greetings2.length)];
          } else if (hours >= 17 && hours <= 24) {
            greet = greetings3[Math.floor(Math.random()*greetings3.length)];
          }
            
          result.forEach(async (user) => {
            let guild = client.guilds.cache.find((g) => g.id === user.guildId)
            if (!guild) return;

            let member = guild.members.cache.find((member) => member.id === user.userId)

            var messages = [
              `I have the pleasure to inform you that **Brawlhalla** currently is streaming, live on Twitch.`,
              `Did you know?!? **Brawlhalla** is streaming! YES. You heard right! Brawlhalla is streaming right now on twitch!`,
              `Hey, just wanted to let you know that **Brawlhalla** is currently streaming. Have a good day 😊`,
              `Hey there fella, just wanna let ya know that **Brawlhalla** is streaming. Have a nice one.`
            ]

            var randomMsg = messages[Math.floor(Math.random()*messages.length)];
            let embed = new MessageEmbed()
              .setTitle(`${greet}, ${member?.user.username}.`)
              .setURL('https://www.twitch.tv/brawlhalla')
              .setDescription(randomMsg)
              .setThumbnail(r.getThumbnailUrl({width: 1000, height: 1000}))
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