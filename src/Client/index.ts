import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import mongoose, { connect, mongo } from 'mongoose';
import path from 'path';
import { readdirSync } from 'fs';
import { Command, SlashCommand, Event, Config } from '../Interfaces';
import * as dotenv from 'dotenv';
import * as gradient from 'gradient-string';
dotenv.config();

class ExtendedClient extends Client {
    public commands: Collection<string, Command> = new Collection();
    public slashCommands: Collection<string, SlashCommand> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public aliases: Collection<string, Command> = new Collection();
    public config: Config = {token: process.env.CLIENT_TOKEN, mongoURI: process.env.REMOTE_MONGODB, prefix: process.env.PREFIX};
    public constructor() {
        super({ 
            intents: [
                Intents.FLAGS.GUILDS, 
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_PRESENCES,
                Intents.FLAGS.GUILD_BANS,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS
            ],
            messageCacheLifetime: 200,
            messageSweepInterval: 180
        });
    }
    public async init() {
        this.login(this.config.token);
        let options = {
            "keepAlive": true,
            "useNewUrlParser": true,
            "useUnifiedTopology": true
        }
        await mongoose.connect(this.config.mongoURI, options).then(async () => {
           console.log(`Connected to ${gradient.fruit('Database')}`)
        }).catch((err) => {
            console.error('App starting error:', err.stack);
        });


        /* Commands */
        const commandPath = path.join(__dirname, "..", "Commands");
        readdirSync(commandPath).forEach((dir) => {
            const commands = readdirSync(`${commandPath}/${dir}`).filter((file) => file.endsWith('.ts'));

            for (const file of commands) {
                const { command } = require(`${commandPath}/${dir}/${file}`);
                this.commands.set(command.name, command);

                if (command.aliases?.length !== 0 && command.aliases) {
                    command.aliases.forEach((alias: any) => {
                        this.aliases.set(alias, command);
                    })
                }
            }
        })

        /* Events */
        const eventPath = path.join(__dirname, "..", "Events");
        readdirSync(eventPath).forEach(async (file) => {
            const { event } = await import(`${eventPath}/${file}`);
            this.events.set(event.name, event);
            console.log(`Name: ${gradient.mind(event.name)}`);
            this.on(event.name, event.run.bind(null, this));
        })


        /* SlashCommands */
        const slashCommandPath = path.join(__dirname, "..", "SlashCommands");
        readdirSync(slashCommandPath).forEach((dir) => {
            const commands = readdirSync(`${slashCommandPath}/${dir}`).filter((file) => file.endsWith('.ts'));

            for (const file of commands) {
                const { slashCommand } = require(`${slashCommandPath}/${dir}/${file}`);
                this.slashCommands.set(slashCommand.name, slashCommand);

                // if (command.aliases?.length !== 0 && command.aliases) {
                //     command.aliases.forEach((alias: any) => {
                //         this.aliases.set(alias, command);
                //     })
                // }
            }
        })
    }
}

export default ExtendedClient;