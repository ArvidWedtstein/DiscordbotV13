import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import icon from '../../Functions/icon';
import items from '../../items.json'
import { addItem, getItems, removeItem } from '../../Functions/UserInventory';
import { ErrorEmbed } from '../../Functions/ErrorEmbed';
export const command: Command = {
    name: "removeitem",
    description: "Remove a item from a user",
    details: "Remove a item from a user",
    aliases: ["itemremove"],
    group: "Inventory",
    hidden: false,
    UserPermissions: ["Administrator"],
    ClientPermissions: ["SendMessages", "AddReactions"],
    ownerOnly: false,
    examples: ["removeitem @user item"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions, content, attachments } = message;
        message.delete()
        if (!guild) return
        const guildId = guild.id;
        const user = guild.members.cache.find(m => m.id == mentions.users.first()?.id || m.id == author.id)
        if (!user) return ErrorEmbed(message, client, command, `${language(guild, 'VALID_USER')}`);

        const userId = user.id  
        args.shift()
        const itemname = args[0].toLowerCase();
        const amount: any = args[1];
        if (isNaN(amount)) return ErrorEmbed(message, client, command, `${language(guild, 'CLEAR_NaN')}`);

        let icon: any = '';
        if (attachments.first()) {
            icon = attachments.first()?.url;
        } else {
            icon = ''
        }
        if (itemname in items) {
            removeItem(guildId, userId, itemname, icon, amount) 
        } else return ErrorEmbed(message, client, command, `${language(guild, 'ADDITEM_NOEXIST')} ${items}`);
    }
}