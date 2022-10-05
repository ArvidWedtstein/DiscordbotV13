import { Event } from '../Interfaces';
import { loadLanguages } from '../Functions/language';
import { loadColors } from '../Functions/icon';
import birthday from '../Functions/birthday';
import settingsSchema from '../schemas/settingsSchema';
import path from 'path';

export const event: Event = {
    name: "guildCreate",
    run: async (client, guild) => {
        console.log('Guild Joined:', guild.name);

        // Create new settings for the guild
        let result = await settingsSchema.findOne({
            guildId: guild.id
        })
        
        if (!result) {
            // Create new settings for the guild
            result = new settingsSchema({
                guildId: guild.id,
                levels: [], // TODO: Default level upset?
                currency: "ErlingCoin",
                language: "english",
            }).save().catch((err: any) => console.log(err))
        }
    }
}