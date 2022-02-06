import { Event, Command} from '../Interfaces';
import Client from '../Client';
import { Message } from 'discord.js';

export const event: Event = {
    name: "interactionCreate",
    run: (client: Client, message: Message) => {
        if (
            message.author.bot ||
            !message.guild
        ) return;

        const args = message.content
            .slice(client.config.prefix.length)
            .trim()
            .split(/ + /g);
        
        const cmd = args.shift()?.toLowerCase();
        if (!cmd) return;
        const command = client.commands.get(cmd) || client.aliases.get(cmd);
        if (command) (command as Command).run(client, message, args);
    }
}