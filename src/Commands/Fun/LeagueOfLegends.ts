import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, EmojiIdentifierResolvable } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
export const command: Command = {
    name: "leagueoflegends",
    aliases: ["lol"],
    description: "check your league stats",
    group: __dirname,
    hidden: false,
    UserPermissions: ["SendMessages", "AddReactions"],
    ClientPermissions: ["SendMessages", "AddReactions"],
    ownerOnly: false,
    examples: ["leagueoflegends"],
    run: async(client, message, args) => {
        const { guild, channel, mentions } = message
        // https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/DrunkGerman/6969
    }
}
