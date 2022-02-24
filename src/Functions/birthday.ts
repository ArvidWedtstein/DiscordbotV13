import { Client, Message, MessageEmbed } from "discord.js";
import profileSchema from "../schemas/profileSchema";
import boticons from "./boticons";
import icon from "./icon";
import language from "./language";
import { addXP, getLevel } from "./Level";
import * as gradient from 'gradient-string';

export default (client: Client) => {
    const checkForBirthday = async () => {
        const list = client.guilds.cache.get('524951977243836417');
        if (!list) return;
        list.members.cache.each(async (member) => {
            const { user, guild } = member;
            const userId = user.id
            const guildId = guild.id;
            let news = guild.channels.cache.find(channel => channel.name === 'nyheter');
            
            if (!news || !news?.isText() || news.isVoice() || news.isThread()) {
                const name = `${language(guild, 'NEWS_CHANNELNAME')}`
                guild.channels.create(name, {
                    topic: "Test"
                })
                
                news = guild.channels.cache.find(channel => channel.name === 'nyheter');
                if (!news) return;
                
            }
            if (news.isThread() || news.isVoice() || !news.isText() || !news || !news.manageable) return;

            const results = await profileSchema.findOne({
                userId
            })
            if (!results) return

            var d = new Date,
            dformat = [
                d.getDate(),
                d.getMonth()+1,
            ].join('/')+''
            const birthday = dformat;
            
            if (results.birthday == '1/1') return;
            if (results.birthday !== birthday) return;

            let embedCom = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle(`${boticons(client, 'firework')}${language(guild, 'BIRTHDAY_ANNOUNCEMENT')}!${boticons(client, 'firework')}`)
                .setThumbnail(member.user.displayAvatarURL())
                .setDescription(`<@${results.userId}> ${language(guild, 'BIRTHDAY_USER')}\n@everyone\n${language(guild, 'PROMOTE_USER')} to <@${results.userId}>! (+5000xp) `)
            
            news?.messages.fetch({ limit: 1 }).then(async (messages) => {
                let lastMessage = messages.first();
                
                if (!lastMessage) return; 
                if (lastMessage?.embeds[0]) {
                    // check if last embed is same as current to prevent double birthday announcement
                    let last = lastMessage.embeds[0].description
                    let str1 = last?.substr(0, last.indexOf(" "))
                    let str2 = embedCom?.description?.substr(0, embedCom.description.indexOf(" "))

                    if (str1 == str2) return;
                    let messageEmbed = lastMessage?.channel.send({ embeds: [embedCom] }).then((message: Message) => {
                        addXP(guildId, userId, 5000, message)
                    })
                } else {
                    let messageEmbed = lastMessage?.channel.send({ embeds: [embedCom] }).then((message: Message) => {
                        addXP(guildId, userId, 5000, message)
                    })
                }
        
            })
        }); 
        setTimeout(checkForBirthday, 43200 * 1000 )
        console.log(`${gradient.instagram(`Checking for birthdays`)}`);

    };
    checkForBirthday();
}


