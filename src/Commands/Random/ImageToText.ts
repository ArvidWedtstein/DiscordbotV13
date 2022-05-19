import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Intents, Constants, Collection, MessageActionRow, MessageButton, MessageEmbed, GuildMember, EmbedFieldData, MessageAttachment } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import axios from 'axios';
import { createWorker } from 'tesseract.js';
export const command: Command = {
    name: "imagetotext",
    description: "converts text in an image to text",
    details: "converts text in an image to text",
    aliases: ["itt"],
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["imagetotext {language}"],
    run: async(client, message, args) => {
        const { guild, mentions, author, member, channel, attachments } = message;

        if (!guild) return
        
        let image = attachments.first();

        if (!image) return temporaryMessage(channel, `Please provide an image`, 10);

        let languages = [
            { name: "english", value: "eng" },
            { name: "german", value: "deu" },
            { name: "norwegian", value: "nor" },
            { name: "french", value: "fra" },
            { name: "irish", value: "gle" },
            { name: "italian", value: "ita" },
            { name: "japanese", value: "jpn" },
        ]
        let lang = languages[0].value;
        if (args[0]) {
            let chosenlang = languages.find((lang) => lang.name === args[0])
            if (!chosenlang) return temporaryMessage(channel, `That language is not supported. Try one of these: ${languages.map(d => d.name).join(', ')}`, 10);
            lang = chosenlang.value;
        }

        try {
            const worker = createWorker()
            await worker.load()
            await worker.loadLanguage(lang)
            await worker.initialize(lang)
            const { data: { text } } = await worker.recognize(image.url)
            await worker.terminate()
            return message.reply(text)
        } catch (err) {
            console.error(err)
        }
        
    }
}


