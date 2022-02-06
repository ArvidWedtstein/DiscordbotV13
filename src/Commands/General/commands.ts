import { Command } from '../../Interfaces';
import { Settings } from '../../settings';
import language from '../../language';
import { addCoins, setCoins, getCoins, getColor } from '../../economy';

export const command: Command = {
    name: "commands",
    description: "add balance to a user",
    aliases: ["commandlist", "botcommands"],
    run: async(client, message, args) => {
        const { guild } = message
        const guildId = guild?.id;
        const cmdstate: any = [];
        client.commands.forEach((c) => {
            console.log(c)
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

        let txt = 'Commands:\n\n'
        for (let command in cmdstate) {
            txt += `**Command** | **Is Enabled**\n`
            txt += `${cmdstate[command].name}: ${cmdstate[command].state}\n`
        }

        await message.reply(txt)
    }
}