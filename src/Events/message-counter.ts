import { Event, Command} from '../Interfaces';
import Client from '../Client';
import { Message } from 'discord.js';
import profileSchema from '../schemas/profileSchema';
import moment from 'moment';

export const event: Event = {
    name: "messageCreate",
    run: async (client: Client, message: Message) => {    
        // var d = new Date();
        // const date = [
        //     d.getDate(),
        //     d.getMonth()+1,
        //     d.getFullYear()
        // ].join('.')
        // setTimeout(
        //     midnightTask,
        //     moment("24:00:00", "hh:mm:ss").diff(moment(), 'seconds')
        // );
         
        // function midnightTask() {

        // }
        if (!message.guild) return
        const { author, guild } = message
        const guildId = guild.id
        const userId = author.id
        if (author.bot) return;

        const result = await profileSchema.findOneAndUpdate({
            userId: userId,
            guildId: guildId,
        }, {
            $inc: {
                'messageCount': 1
            },
        }, {
            upsert: true,
        }).catch((err: any) => {
            console.log(err)
        })
        
    }
}
