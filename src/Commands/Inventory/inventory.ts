import { Command } from '../../Interfaces';
import { Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, Client, CommandInteraction, Message, AttachmentBuilder } from 'discord.js';
import { getItems, giveItem, addItem, removeItem } from '../../Functions/UserInventory';
import language from '../../Functions/language';
import itemlist from '../../items.json';

export const command: Command = {
  name: "inventory",
  description: "get your inventory",
  details: "get a list of your items in your inventory",
  aliases: ["bag"],
  group: __dirname.toLowerCase(),
  hidden: false,
  ownerOnly: false,
  UserPermissions: ["SendMessages"],
  ClientPermissions: [
    'SendMessages',
    'AddReactions',
    'ATTACH_FILES',
    'EmbedLinks',
    'MANAGE_MESSAGES',
    'READ_MESSAGE_HISTORY',
    'ViewChannel',
  ],
  run: async(client, message, args) => {
    const { guild, mentions, author, channel } = message

    if (!guild) return;

    let count: {[k: string]: any} = {};
    const target = mentions.users.first() || author;
    const guildId = guild.id;
    const userId = target.id;

    // Get users items
    const items: any = await getItems(guildId, userId);

    function capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const listofitems: any = itemlist;
    let itemtxt: any = []; 

    if (items == null) {
      itemtxt.push('No items')
    } else {    
      for (const item of items) {
        let { name, icon } = item
        itemtxt.push(`${client.emojis.cache.find((e: { id: any; }) => e.id === listofitems[name].emoji)} ${capitalizeFirstLetter(name)} (${(count[name]||0) + 1}x)`)
      }
    }
    itemtxt = [`**Item${itemtxt.length === 1 ? '' : 's'}**: `].concat(itemtxt)
    function emptyarray (arr: any) {
      return arr.length = 0
    }
    
    const attachment = new AttachmentBuilder('./img/banner.jpg');

    let embed = new EmbedBuilder()
      .setColor('#ff4300')
      .setAuthor({name: `${target.username}'s ${await language(guild, 'INVENTORY_TITLE')}`, iconURL: target.displayAvatarURL()})
      .setDescription(itemtxt.join('\n'))
      .setImage('attachment://banner.jpg')
      .setFooter({ text: `Requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
    
    let msgembed = await channel.send({ embeds: [embed], files: [attachment] });
    emptyarray(itemtxt);
    itemtxt = ''
    count = {}
  }
}