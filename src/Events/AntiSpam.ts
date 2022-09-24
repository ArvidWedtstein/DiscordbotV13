import { Event, Command} from '../Interfaces';
import Client from '../Client';
import { Message } from 'discord.js';
import temporaryMessage from '../Functions/temporary-message';
import language from '../Functions/language';
const usersMap = new Map();
const LIMIT = 5
const TIME = 1000 * 30;
const DIFF = 3000;
export const event: Event = {
    name: "messageCreate",
    run: async (client: Client, message: Message) => {
        const { author, content, guild, member, channel, createdTimestamp } = message;
        if (
            author.bot ||
            !guild ||
            !content.startsWith(client.config.prefix)
        ) return;

        if (usersMap.has(author.id)) {
            const userData = usersMap.get(author.id);
            const {lastMessage, timer} = userData;
            const difference = createdTimestamp - lastMessage.createdTimestamp;
            let msgCount = userData.msgCount;
            if (difference > DIFF) {
                clearTimeout(timer);
                userData.msgCount = 1;
                userData.lastMessage = message;
                userData.timer = setTimeout(() => {
                    usersMap.delete(author.id);
                }, TIME);
                usersMap.set(author.id, userData);
            } else {
                ++msgCount;
                if (parseInt(msgCount) === LIMIT) {
                    //const mute = message.guild.roles.cache.get('719816647455539221')
                    const mute = guild.roles.cache.find(role => role.name === "Muted");
                    if (!mute) {
                        //message.guild.roles.create( {name: 'Muted', color: "#818386" } )
                        let mute2 = await guild?.roles.create({ name: 'Muted', color: '#818386', permissions: [] });
                        
                        
                        setTimeout(async () => {                    
                            member?.roles.add(mute2);
                            const highestrole = guild.roles.highest;
                            if (!highestrole) return
                            await mute2.setPosition(highestrole.position - 1);
                            setTimeout(() => {
                                member?.roles.remove(mute2);
                            }, TIME)
                        }, 500)
                    } else {
                        await member?.roles.add(mute);
                        //message.author.send('You have been muted for spamming')
                        setTimeout(() => {
                            member?.roles.remove(mute);
                        }, TIME)
                    }
                    
                    
                } else {
                    userData.msgCount = msgCount;
                    usersMap.set(message.author.id, userData);
                }
            }
        } else {
            let fn = setTimeout(() => {
                usersMap.delete(message.author.id);
                //console.log('Removed from map.');
                //message.author.send('You have been unmuted')
            }, TIME)
            usersMap.set(message.author.id, {
                msgCount: 1,
                lastMessage: message,
                timer: fn
            });
        }

    }
}