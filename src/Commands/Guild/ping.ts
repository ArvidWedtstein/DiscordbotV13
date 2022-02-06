import { Command } from '../../Interfaces';
import { Settings } from '../../settings';
import language from '../../language';
import { addCoins, setCoins, getCoins, getColor } from '../../economy';
export const command: Command = {
    name: "ping",
    run: async(client, message, args) => {
        message.channel.send(`${client.ws.ping} ping!`);
    }
}