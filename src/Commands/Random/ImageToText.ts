import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, GuildMember, AttachmentBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import axios from 'axios';
import { createWorker } from 'tesseract.js';
import { ErrorEmbed } from '../../Functions/ErrorEmbed';
export const command: Command = {
    name: "imagetotext",
    description: "converts text in an image to text",
    details: "converts text in an image to text",
    aliases: ["itt"],
    hidden: false,
    UserPermissions: ["SendMessages"],
    ClientPermissions: ["SendMessages", "AddReactions"],
    ownerOnly: false,
    examples: ["imagetotext {language}"],
    run: async(client, message, args) => {
        const { guild, mentions, author, member, channel, attachments } = message;

        if (!guild) return
        
        let image = attachments.first();

        if (!image) return ErrorEmbed(message, client, command, `Please provide an image`);

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
            if (!chosenlang) return ErrorEmbed(message, client, command, `That language is not supported. Try one of these: ${languages.map(d => d.name).join(', ')}`);
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


