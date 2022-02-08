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
        client.commands.forEach((c) => {
            if (c.ownerOnly) return;
            if (c.hidden) return;
            console.log(c)
            txt += `**Command** | **Description**\n`
            txt += `${c.name}: ${c.description}\n`
        })
        // this.client.registry.groups.forEach((e) => {
        //     e.commands.forEach((c) => {
        //         if (c.hidden) return
        //         if (c.ownerOnly) return
        //         if (c.guarded) {
        //             cmdstate.push({name: c.name, state: `${c.isEnabledIn(guild)} ${boticons(this.client, 'secure')}`})
        //         } else {
        //             cmdstate.push({name: c.name, state: `${c.isEnabledIn(guild)}`})
        //         }
        //     })
        // })

        await message.reply(txt)
    }
}