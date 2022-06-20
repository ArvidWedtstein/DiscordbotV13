import { Event, Command} from '../Interfaces';
import Client from '../Client';
import { Message, MessageEmbed } from 'discord.js';
import afk from '../Collection';
import moment from 'moment';
import { time } from '@discordjs/builders';
import temporaryMessage from '../Functions/temporary-message';

export const event: Event = {
    name: "messageCreate",
    run: (client: Client, message: Message) => {
        const { guild } = message
    if (!guild) return;
    const guildId = guild.id;  
    if (message.author.username != "Drinkledonk") return;
    if (guildId != '524951977243836417') return;
    
    if (!guild) {
        return
    }
    const allowedusers = [
        'Bass_Gamer',
        'DianDaldedom'
    ]
    const alertreasons = [
        'destroyed',
        'was killed',
        'Tribemember',
    ]
    let msg2 = message.content;
    let msg = msg2.substring(msg2.indexOf(':') + 7)
    let msgarray = msg.split(/ +/);
    for (let i = 0; i < alertreasons.length; i++) {
        // Tribe dino has been killed
        if (msgarray[0] == 'Your') {
            let embed = new MessageEmbed()
                .setTitle(`Dino Killed`)
                .setDescription(`Our ${msg.substring(5, msg.indexOf('-'))} got killed by a ${msgarray[11]}`)
            let msgembed = message.channel.send({ embeds: [embed] });
            return
        }
        if (msg.includes(alertreasons[i])) {
            for (let x = 0; x < allowedusers.length; x++) {
                if (msg.includes(allowedusers[x])) {
                    if (msgarray[1] == allowedusers[i]) {
                        if (msgarray[8] == allowedusers[i]) return;
                        message.channel.send(`<@${guild.ownerId}>, we're getting attacked.`);
                        return
                    }
                    return
                } else {
                    if (msg.includes('destroyed')) {
                        message.channel.send(`<@${guild.ownerId}>, we're getting attacked.`);
                        return
                    }
                }
            }
        }
    }
        


        
    }
}