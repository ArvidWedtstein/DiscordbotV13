import Client from '../Client';
import { ClientEvents, Collection, Message } from 'discord.js';
import { Command } from './Command';
import { CommandGroup } from './CommandGroup';
import fs from 'fs';
import * as gradient from 'gradient-string';
import path from 'path'
export class Registry {
    public client;
    public commands: Collection<string, Command> = new Collection();
    public commandsPath?: string;
    public groups: Collection<string, CommandGroup> = new Collection();
    public unknownCommand?: Command;
    constructor(client: Client) {
        this.client = client;
        Object.defineProperty(this, 'client', { value: client });
    };
    registerGroup(group: CommandGroup|string, name?: any, guarded?: any) {
		if(typeof group === 'string') {
			group = new CommandGroup(this.client, group, name, guarded);
		} else if(isConstructor(group, CommandGroup)) {
			group = new CommandGroup(this.client, 'd'); // eslint-disable-line new-cap
		} else if (typeof group === 'object' && (group instanceof CommandGroup)) {
			group = new CommandGroup(this.client, group.id, group.name, group.guarded);
		}
		const existing = this.groups.get(group.id);
		if(existing) {
			existing.name = group.name;
			this.client.emit('debug', `Group ${group.id} is already registered; renamed it to "${group.name}".`);
		} else {
			this.groups.set(group.id, group);

			this.client.emit('groupRegister', group, this);
			this.client.emit('debug', `Registered group ${group.id}.`);
		}
		return this;
	}
    /**
	 * Registers multiple groups
	 * @example
	 * registry.registerGroups([
	 * 	{ id: 'fun', name: 'Fun' },
	 * 	{ id: 'mod', name: 'Moderation' }
	 * ]);
	 */
    registerGroups(groups: CommandGroup[]|Object[]|Array<string[]|any>) {
		if(!Array.isArray(groups)) throw new TypeError('Groups must be an Array.');
		for(const group of groups) {

			if(Array.isArray(group)) this.registerGroup(group[0], group[1]);
			else this.registerGroup(group.id, group.name);
		}
		return this;
	}
    registerCommand(command: Command) {
		// Make sure there aren't any conflicts
        if (command.aliases) {
            for(const alias of command?.aliases) {
                if(this.commands.some(cmd => cmd.name === alias) || this.commands.some(cmd => cmd.aliases?.includes(alias) || false)) {
                    throw new Error(`A command with the name/alias "${alias}" is already registered.\n At ${gradient.retro((this.commands.find(cmd => cmd.name === alias) || this.commands.find(cmd => cmd.aliases?.includes(alias) || false))?.name)} command and \n${gradient.retro(command.name)}`);
                }
				this.client.aliases.set(alias, command);
            }
        }
		const group = this.groups.find(grp => grp.id === command.group.toLowerCase());
		if(!group) throw new Error(`Group "${command.group}" is not registered.`);
		if(group.commands.some(cmd => cmd.name === command.name)) {
			throw new Error(`A command with the member name "${command.name}" is already registered in ${group.id}`);
		}
		if(this.unknownCommand) throw new Error('An unknown command is already registered.');

		// Add the command
		command.group = group;
		group.commands.set(command.name, command);
		this.commands.set(command.name, command);

		this.client.emit('commandRegister', command, this);
		this.client.emit('debug', `Registered command ${group.id}:${command.name}.`);
		
		return this;
	}
	registerCommands(commands: Command[], ignoreInvalid = false) {
		if(!Array.isArray(commands)) throw new TypeError('Commands must be an Array.');
		for(const command of commands) {
			const valid = (command as Command);
			if(ignoreInvalid && !valid) {
				this.client.emit('warn', `Attempting to register an invalid command object: ${command}; skipping.`);
				continue;
			}
			this.registerCommand(command);
		}
		
		return this;
		
	}
    /**
	 * Registers all commands in a directory. The files must export a Command class constructor or instance.
	 * @param {string|RequireAllOptions} options - The path to the directory, or a require-all options object
	 * @return {CommandoRegistry}
	 * @example
	 * const path = require('path');
	 * registry.registerCommandsIn(path.join(__dirname, 'commands'));
	 */
	registerCommandsIn(options: string|any) {
		fs.readdirSync(options).forEach((dir) => {
			if (this.groups.find(g => g.id === dir.toLowerCase())) {
				// Check whether commands are TypeScript or have been compiled to Javascript
				var extension = path.basename(__filename).split(".").pop()

				const commands: any = fs.readdirSync(`${options}/${dir}`).filter((file) => file.endsWith(`.${extension}`));
				const commands2 = []
				for (const file of commands) {
					const { command } = require(`${options}/${dir}/${file}`);
					Object.assign(command, {group: dir})
					commands2.push(command)
				}
				if(typeof options === 'string' && !this.commandsPath) this.commandsPath = options;
				else if(typeof options === 'object' && !this.commandsPath) this.commandsPath = options.dirname;
				return this.registerCommands(commands2, true);
			}
        })
	}
}

function isConstructor(func: any, _class: any) {
	try {
		// eslint-disable-next-line no-new
		new new Proxy(func, isConstructorProxyHandler)();
		if(!_class) return true;
		return func.prototype instanceof _class;
	} catch(err) {
		return false;
	}
}
const isConstructorProxyHandler = { construct() { return Object.prototype; } };