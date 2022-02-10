import { Event, Command} from '../Interfaces';
import Client from '../Client';
import { Message } from 'discord.js';
import { addXP } from '../Functions/Level';
let messagecache = ''
export const event: Event = {
    name: "messageCreate",
    run: (client: Client, message: Message) => {    

        const { guild, member, author } = message
        if (author.bot || member?.user.bot) {
            return
        }
        if (author.id == '787324889634963486') return;
        
        if (!guild) return;
        return;
        /*if (xps >= 100) {
            message.author.send('You have reached maximum xp per minute.')
            setTimeout(function() {
                xps = 0;
                //addXP(guild.id, member.id, 5, message)
                
                //console.log(xps)
                return;
            }, 1000 * 60)
        } else if (xps < 100) {
            xps += 5
            //console.log(xps)
            addXP(guild.id, member.id, 5, message)
        }*/


        // Checks if last message is same as sendt message. Prevents spam of the same message to earn xp.
        // if (messagecache == message.content) return

        // addXP(guild?.id, author?.id, 8, message)
        // messagecache = message.content;
    }
}