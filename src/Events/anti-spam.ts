import { Event, Command} from '../Interfaces';
import Client from '../Client';
import { Message, User, Guild, GuildMember } from 'discord.js';

export const event: Event = {
    name: "messageCreate",
    run: async (client: Client, message: Message) => {
        const { guild, author, createdTimestamp }: { 
            guild: any, 
            author: User, 
            createdTimestamp: number, 
        } = message;

        if (
            author.bot ||
            !guild?.available
        ) return;

        const usersMap = new Map();
        const LIMIT = 5
        const TIME = 1000 * 30;
        const DIFF = 3000;

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
                    const mute = guild.roles.cache.find((role: any) => role.name === "Muted");

                    // If no muted role exist, create a new role.
                    if (!mute) {
                        //message.guild.roles.create( {name: 'Muted', color: "#818386" } )
                        guild.roles.create({ data: { name: 'Muted', color: '#818386', permissions: [] } });
                        
                        
                        setTimeout(async () => {
                            let mute2 = await guild.roles.cache.find((roleval: any) => roleval.name === "Muted");
                            if (!mute2) return;
                            message.member?.roles.add(mute2);
                            const highestrole = guild.me.roles.highest;
                            await mute2.setPosition(highestrole.position - 1);
                            setTimeout(() => {
                                message.member?.roles.remove(mute2);
                            }, TIME)
                        }, 500)
                    } else {
                        await message.member?.roles.add(mute);
                        //message.author.send('You have been muted for spamming')
                        setTimeout(() => {
                            message.member?.roles.remove(mute);
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