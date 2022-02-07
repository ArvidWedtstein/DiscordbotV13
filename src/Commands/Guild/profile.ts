import { Command } from '../../Interfaces';
import { Settings } from '../../settings';
import * as gradient from 'gradient-string';
import language from '../../language';
import { addCoins, setCoins, getCoins, getColor } from '../../economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
export const command: Command = {
    name: "profile",
    run: async(client, message, args) => {
        
    }
}