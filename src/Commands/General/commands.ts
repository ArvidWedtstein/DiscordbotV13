import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';

export const command: Command = {
    name: "commands",
    description: "add balance to a user",
    aliases: ["commandlist", "botcommands"],
    run: async(client, message, args) => {
        const { guild } = message
        const guildId = guild?.id;
        let txt = 'Commands:\n\n'
        txt += `**Command** | **Description**\n`
        client.registry.commands.forEach((c) => {
            const { name, description, hidden, ownerOnly } = c;
            
            if (!ownerOnly && !hidden && txt.length < 1900) {
                txt += `${name}: ${description}\n`
            };
        })

        await message.reply(txt)
    }
}