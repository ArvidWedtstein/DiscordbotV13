import { 
    MessageEmbed, 
    EmbedAuthorData, 
    EmbedFieldData, 
    EmbedFooterData, 
    ColorResolvable, 
    MessageEmbedImage, 
    MessageEmbedThumbnail, 
    GuildEmoji, 
    TextChannel, 
    PartialDMChannel, 
    DMChannel, 
    NewsChannel, 
    ThreadChannel, 
    ReactionEmoji,
    Message,
    MessageActionRow,
    MessageButton,
    Interaction,
    Guild,
    MessageEmbedOptions,
    MessageAttachment,
} from "discord.js";
import settingsSchema from "../schemas/settingsSchema";
import { Canvas } from "@napi-rs/canvas"
import { re } from "mathjs";

export interface PageEmbedOptions {
    title?: string;
    description?: string;
    url?: string;
    timestamp?: Date | number;
    color?: ColorResolvable;
    fields?: EmbedFieldData[];
    author?: { 
        name: string;
        url?: string;
        iconURL?: string;
    };
    thumbnail?: MessageEmbedThumbnail;
    image?: MessageEmbedImage;
    footer?: { 
        text: string;
        iconURL?: string;
    };
    reactions?: object;
    settings?: {
        type: string;
    };
    files?: any[];
    canvas?: Canvas;
}


export class PageEmbed {
    public pages: PageEmbedOptions[];
    private currentPage: number;
    private component: MessageActionRow;
    private settings: any;
    constructor(pages: PageEmbedOptions[])
    {
        this.pages = pages
        this.currentPage = 0;
        this.component = new MessageActionRow();
    }
    private generate(page: PageEmbedOptions, channel: DMChannel | TextChannel | NewsChannel | ThreadChannel | PartialDMChannel, disable: boolean = false) {
        // Update the footer text to the new page number
        if (!page.canvas) {
            page.footer = {text: `Page ${this.currentPage+1} of ${this.pages.length}`} 
            page.image = { url: `attachment://banner.gif` }
        }
        let row = page.settings ? this.settingsBtn(page.settings.type, disable) : this.getRow(disable)
        const attachment = new MessageAttachment('./img/banner.gif', 'banner.gif');
        return { 
            embeds: page.canvas ? [] : [new MessageEmbed(page)], 
            components: [this.component],
            files: page.canvas ? [new MessageAttachment(page.canvas.toBuffer('image/png'), `image.png`)] : [attachment]
        }
    }
    async post(message: Message) {
        const { channel, author, guild } = message
        if (!guild) return

        const guildId = guild.id;

        let page = this.pages[this.currentPage];
        
        let result: any;

        // If settings is specified on one of the pages, then we need to get the settings from the database
        if (this.pages.some(pag => pag.settings)) {
            result = await settingsSchema.findOne({ guildId });

            if (!result) {
                result = new settingsSchema({ guildId }).save()
            }
            this.settings = result;
        }

    
        const messageEmbed = channel.send(this.generate(page, channel)).then(async (m) => {

            // Add reactions to the embed

            // TODO - Handle emoji reactions seperately


            const filter = (i: Interaction) => i.user.id === author.id;

            // Create a collector for the buttons
            const collector = m.createMessageComponentCollector({
                filter,
                time: 5 * (1000 * 60)
            })

            
            collector.on('collect', async (reaction) => {
                if (!reaction) return;

                reaction.deferUpdate();

                // Check if setting has been toggled
                if (page.settings && reaction.customId === `embed_on_${page.settings.type}` || page.settings && reaction.customId === `embed_off_${page.settings.type}`) {
                    this.settings[page.settings.type] = !this.settings[page.settings.type] // Toggle the setting
                    result = this.settings

                    await m.edit(this.generate(page, channel))
                    return
                }

                if (reaction.customId === 'embed_save_and_close') {
                    console.log('save')
                    this.save(guildId)
                    return
                }

                // Check if page has gone over or under the max
                reaction.customId === 'prev_embed' ? 
                    (this.currentPage <= 0 ? this.currentPage = this.pages.length-1 : this.currentPage = this.currentPage) : 
                    (this.currentPage >= this.pages.length-1 ? this.currentPage = - 1 : this.currentPage = this.currentPage)

                // Add or subtract from the current page
                reaction.customId === 'prev_embed' ? (this.currentPage -= 1) : (this.currentPage += 1)

                // Update the page
                page = this.pages[this.currentPage];
            
                await m.edit(this.generate(page, channel))
            })

            // When collector has finished, then update guilds settings
            collector.on('end', async (reaction) => {
                if (this.pages.some(pag => pag.settings)) {

                    this.save(guildId);
                }
                // Disable buttons
                m.edit(this.generate(page, channel, true))
                return
            })
        })     
    }
    private getRow(disabled: boolean = false) {
        this.component.setComponents(
            new MessageButton({
                customId: 'prev_embed',
                style: "SECONDARY",
                emoji: "⬅",
                disabled: !disabled ? this.currentPage === 0 : disabled
            }),
            new MessageButton({
                customId: 'next_embed',
                style: "SECONDARY",
                emoji: "➡",
                disabled: !disabled ? this.currentPage === this.pages.length - 1 : disabled
            })
        )
        return;
    }
    private async save(guildId: string) {
        let updates: any = {};
        let lap = this.pages.filter(pag => pag.settings)
        let s = lap.map(x => x.settings?.type ? x.settings.type : '')
        for (let i = 0; i < s.length; i++) {
            updates[s[i]] = this.settings[s[i]]
        }
        console.log(updates)
        let result = await settingsSchema.findOneAndUpdate(
            {
                guildId,
            }, {
                $set: updates
            }, {
                upsert: true
            }
        )
        this.settings = result;
    }
    private async settingsBtn(setting: string, disabled: boolean = false) {
        this.component.setComponents(
            new MessageButton({
                customId: 'prev_embed',
                style: "SECONDARY",
                emoji: "⬅",
                disabled: !disabled ? this.currentPage === 0 : disabled
            }),
            new MessageButton({
                customId: 'next_embed',
                style: "SECONDARY",
                emoji: "➡",
                disabled: !disabled ? this.currentPage === this.pages.length - 1 : disabled
            }),
            new MessageButton({
                customId: `embed_save_and_close`,
                style: "SECONDARY",
                emoji: "💾",
                disabled: disabled
            }),
            new MessageButton({
                customId: this.settings[setting] == true ? `embed_on_${setting}` : `embed_off_${setting}`,
                style: this.settings[setting] == true ? "SUCCESS" : "DANGER",
                emoji: this.settings[setting] == true ? "✅" : "❌",
                disabled: disabled
            })
        )
        this.pages[this.currentPage].color = this.settings[setting] == true ? "#00ff00" : "#ff0000"
        this.pages[this.currentPage].author = { name: `${setting}: ${this.settings[setting]}`}
        return
    }
}