import { Event } from '../Interfaces';
import * as gradient from 'gradient-string';
import { loadLanguages } from '../Functions/language';
import { loadColors } from '../Functions/icon';
import birthday from '../Functions/birthday';
import path from 'path';

export const event: Event = {
    name: "guildCreate",
    run: async (client, guild) => {
        console.log('Guild Created:', guild);
    }
}