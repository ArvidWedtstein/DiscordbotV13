import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import icon from '../../Functions/icon';
import profileSchema from '../../schemas/profileSchema';
export const command: Command = {
    name: "serverinfo",
    description: "check info of a server",
    details: "Check the stats of a guild.",
    aliases: ["guildinfo", "server"],
    group: "Guild",
    hidden: false,
    UserPermissions: ["SendMessages"],
    ClientPermissions: ["SendMessages", "AddReactions"],
    ownerOnly: false,
    examples: ["serverinfo", "server"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions } = message;
        if (!guild) return;
        const { name, memberCount, afkTimeout, fetchOwner: owner, roles, presences } = guild
        
        const icon = guild.iconURL();
        const splash = guild.splashURL()
        const banner = guild.bannerURL();
        const news = guild.publicUpdatesChannel
        const discoverySplash = guild.discoverySplashURL()
        //const guildfeatures = guild.features
        const guildId = guild.id;
        

        const msgresult = await profileSchema.find({
            guildId: guildId,
            messageCount: { $gt: 0, $exists: true }
        })
        // const gwresult = await profileSchema.find({
        //     guildId: guildId,
        //     guessedWords: { $exists: true, $not: null }
        // })

        let msgnmb = msgresult.reduce((accumulator, object) => {
            return accumulator + object.messageCount;
        }, 0);
        console.log('Messages: ', msgnmb)

        

        // Get server boosters
        let nitroboosters: any = 0;
        const nitroRole = guild.roles.cache.find(r => r.name === 'Server Booster')
        if (nitroRole) {
            nitroboosters = roles.cache.get(nitroRole.id)?.members.size;
        }


        
        const embed = new EmbedBuilder()
            .setTitle(`${language(guild, 'SERVERINFO_TITLE')} "${name}"`)
            .setColor(client.config.botEmbedHex)
            .addFields(
                { name: "Activities", value: `${presences.cache.map(x => x.activities)}`, inline: false},
                {
                    name: `${language(guild, 'SERVERINFO_MEMBERS')}`,
                    value: `${memberCount}`,
                    inline: false
                },
                {
                    name: `${await language(guild, 'SERVERINFO_OWNER')}`,
                    value: `${(await guild.fetchOwner()).user.tag}`,
                    inline: false
                },
                {
                    name: 'AFK Timeout',
                    value: afkTimeout / 60 + 'min',
                    inline: false
                },
                {
                    name: `${language(guild, 'SERVERINFO_MESSAGESSENT')}`,
                    value: `${msgnmb}`,
                    inline: false
                },
                // {
                //     name: `Words Guessed:`,
                //     value: `${msgnmb}`,
                //     inline: false
                // },
                {
                    name: `Server Booster${nitroboosters === 1 ? '' : 's'}:`,
                    value: `${nitroboosters}`,
                    inline: false
                }
            )
        if (icon) embed.setThumbnail(icon)
        if (splash) embed.setImage(splash)
        channel.send({ embeds: [embed] });
    }
}
