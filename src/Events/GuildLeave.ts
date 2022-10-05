import { Event } from '../Interfaces';
import { loadLanguages } from '../Functions/language';
import { loadColors } from '../Functions/icon';
import birthday from '../Functions/birthday';
import settingsSchema from '../schemas/settingsSchema';
import path from 'path';

export const event: Event = {
    name: "guildDelete",
    run: async (client, guild) => {
        console.log('Guild Leave:', guild.name);

        // Delete settings for the guild
        let result = await settingsSchema.findOneAndDelete({
            guildId: guild.id
        }).catch((err: any) => console.log(err))
    }
}