import { ClientEvents, Collection, Message } from 'discord.js';
import { Command } from '.';
import Client from '../Client';
export class CommandGroup {
    public client: Client;
    public id: string;
    public name: string;
    public commands: Collection<string, Command>;
    public guarded: boolean;
    public _globalEnabled;
	constructor(client: Client, id: string, name?: string, guarded = false) {
		if(!client) throw new Error('A client must be specified.');
		if(typeof id !== 'string') throw new TypeError('Group ID must be a string.');
		if(id !== id.toLowerCase()) throw new Error('Group ID must be lowercase.');

        this.client = client;
		this.id = id;

		this.name = name || id;

		this.commands = new Collection();

		this.guarded = guarded;

		this._globalEnabled = true;
	}

	setEnabledIn(guild: any, enabled: any) {
		if(typeof guild === 'undefined') throw new TypeError('Guild must not be undefined.');
		if(typeof enabled === 'undefined') throw new TypeError('Enabled must not be undefined.');
		if(this.guarded) throw new Error('The group is guarded.');
		if(!guild) {
			this._globalEnabled = enabled;
			this.client.emit('groupStatusChange', null, this, enabled);
			return;
		}
		guild = this.client.guilds.resolve(guild);
		guild.setGroupEnabled(this, enabled);
	}

	isEnabledIn(guild: any) {
		if(this.guarded) return true;
		if(!guild) return this._globalEnabled;
		guild = this.client.guilds.resolve(guild);
		return guild.isGroupEnabled(this);
	}

	/**
	 * Reloads all of the group's commands
	 */
	// reload() {
	// 	for(const command of this.commands.values()) command.reload();
	// }
}
