import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import language, { insert } from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import temporaryMessage from '../../Functions/temporary-message';

export const command: Command = {
    name: "addbalance",
    description: "add balance to a user",
    aliases: ["addbal"],
    UserPermissions: ['BAN_MEMBERS'],
    run: async(client, message, args) => {
        const { guild, channel, mentions, reply } = message
        if (!guild) return;
        const guildId = guild?.id

        const setting = await Settings(message, 'money');
        if (!setting) return temporaryMessage(channel, `${insert(guild, 'SETTING_OFF', "Economy")}`, 10);
            
        const mention = mentions.users.first();
    
        if (!mention) return temporaryMessage(channel, `${language(guild, 'VALID_USER')}`, 10)

        const coins: number = parseInt(args[1]);
        
        if (isNaN(coins)) return temporaryMessage(channel, `${language(guild, 'ECONOMY_VALID')}`, 10)

        const userId = mention.id

        const newCoins = await addCoins(guildId, userId, coins)

        reply(`${await language(guild, 'ECONOMY_PAY')} <@${userId}> ${coins} ErlingCoins. \n<@${userId}>, ${await language(guild, 'ECONOMY_PAYLEFT')} ${newCoins} ErlingCoins!`)
    }
}