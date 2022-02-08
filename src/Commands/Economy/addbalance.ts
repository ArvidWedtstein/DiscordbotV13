import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';

export const command: Command = {
    name: "addbalance",
    description: "add balance to a user",
    aliases: ["addbal"],
    run: async(client, message, args) => {
        const { guild } = message
        const guildId = guild?.id
        message.delete();
        const setting = await Settings(message, 'money');
        if (setting == false) {
            message.reply(`${await language(guild, 'SETTING_OFF')} Economy ${await language(guild, 'SETTING_OFF2')}`);
            return
        } else if (setting == true) {
            const mention = message.mentions.users.first();
        
            if (!mention) {
                message.reply(`${await language(guild, 'VALID_USER')}`)
                return
            }

            const coins: number = parseInt(args[1]);
            if (isNaN(coins)) {
                message.reply(`${await language(guild, 'ECONOMY_VALID')}`)
                return
            }

            const userId = mention.id

            const newCoins = await addCoins(guildId, userId, coins)

            message.reply(`${await language(guild, 'ECONOMY_PAY')} <@${userId}> ${coins} ErlingCoins. \n<@${userId}>, ${await language(guild, 'ECONOMY_PAYLEFT')} ${newCoins} ErlingCoins!`)
        }
    }
}