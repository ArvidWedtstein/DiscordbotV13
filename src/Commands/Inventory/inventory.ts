import { Command } from '../../Interfaces';
import { Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, Client, CommandInteraction, Message } from 'discord.js';
import { getItems, giveItem, addItem, removeItem } from '../../Functions/UserInventory';
import inventorySchema from '../../schemas/inventorySchema';
import language from '../../Functions/language';
import itemlist from '../../items.json';

export const command: Command = {
    name: "inventory",
    run: async(client, message, args) => {
      const date1 = Date.now();
      let count: {[k: string]: any} = {};
      const target = message.mentions.users.first() || message.author;
      const { guild } = message
      const guildId = message.guild?.id
      const userId = target.id

      // Command Stats Counter
      //cmdUse(guildId, 'inventory')

      const items: any = await getItems(guildId, userId);
      function capitalizeFirstLetter(string: string) {
          return string.charAt(0).toUpperCase() + string.slice(1);
      }
      const listofitems: any = itemlist;
      let txt;
      let itemtxt = `` 
      let itemarray = []
      if (!items) {
        //console.log('noitems')
        await new inventorySchema({
          guildId,
          userId
        }).save()
        itemtxt += 'No items'
      } else if (items == null) {
        //console.log('null')
        
        itemtxt += 'No items'
      } else {    
        for (const item of items) {
            let { name, icon } = item
            itemarray.push(name)
        }
        itemarray.forEach(function(i) { 
          count[i] = (count[i]||0) + 1
        });
        for (const key in count) {
          console.log(count)
          txt = `${client.emojis.cache.find((e: { id: any; }) => e.id === listofitems[key].name)} ${capitalizeFirstLetter(key)} (${count[key]}x)\n`
          itemtxt += txt
        }
      }

      function emptyarray (arr: any) {
        return arr.length = 0
      }
      let embed = new MessageEmbed()
      .setColor('#ff4300')
      .setAuthor({name: `${target.username}'s ${await language(guild, 'INVENTORY_TITLE')}`, iconURL: target.displayAvatarURL()})
      .addField(`Item${itemarray.length === 1 ? '' : 's'}: `, `${itemtxt}.`)
      
      let messageEmbed = await message.channel.send({ embeds: [embed]});
      emptyarray(itemarray);
      itemtxt = ''
      count = {}
    }
}