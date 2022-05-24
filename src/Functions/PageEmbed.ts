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
    constructor(pages: PageEmbedOptions[])
    {
        this.pages = pages
        this.currentPage = 0;
        this.component = new MessageActionRow();
    }
    private generate(page: PageEmbedOptions, channel: DMChannel | TextChannel | NewsChannel | ThreadChannel | PartialDMChannel) {
        // Update the footer text to the new page number
        if (!page.canvas) {
            page.footer = {text: `Page ${this.currentPage+1} of ${this.pages.length}`} 
            page.image = { url: `attachment://banner.jpg` }
        }
        
        const attachment = new MessageAttachment('./img/banner.jpg', 'banner.jpg');
        return { 
            embeds: page.canvas ? [] : [new MessageEmbed(page)], 
            components: [this.getRow()],
            files: page.canvas ? [new MessageAttachment(page.canvas.toBuffer('image/png'), `weatherimage.png`)] : [attachment]
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
        }

    
        const messageEmbed = channel.send(this.generate(page, channel)).then(async (m) => {

            // Add reactions to the embed

            // TODO - Handle emoji reactions seperately
            
            // if (page.reactions && await Object.values(page.reactions).length > 0) {
            //     for (let i = 0; i < Object.values(page.reactions).length; i++) {
            //         let emoji: any = Object.values(page.reactions)[i];
            //         m.react(emoji)
            //     }
            // }

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

                    result[page.settings.type] = !result[page.settings.type] // Toggle the setting

                    await this.settingsBtn(m, page.settings.type, result)
                    await m.edit(this.generate(page, channel))
                    return;
                }

                // Check if page has gone over or under the max
                reaction.customId === 'prev_embed' ? 
                    (this.currentPage <= 0 ? this.currentPage = this.pages.length-1 : this.currentPage = this.currentPage) : 
                    (this.currentPage >= this.pages.length-1 ? this.currentPage = - 1 : this.currentPage = this.currentPage)

                // Add or subtract from the current page
                reaction.customId === 'prev_embed' ? (this.currentPage -= 1) : (this.currentPage += 1)

                // Update the page
                page = this.pages[this.currentPage];
               

                this.getRow();

                if (page.settings) {
                    this.settingsBtn(m, page.settings.type, result)

                    m.edit(this.generate(page, channel))
                    return
                }

                await m.edit(this.generate(page, channel))
            })

            // When collector has finished, then update guilds settings
            collector.on('end', async (reaction) => {
                if (this.pages.some(pag => pag.settings)) {
                    result = await settingsSchema.findOneAndUpdate(
                        {
                            guildId,
                        }, {
                            result
                        }, {
                            upsert: true
                        }
                    )
                }
                // Disable buttons
                
                this.getRow(true)
                m.edit(this.generate(page, channel))
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
        return this.component;
    }
    private async settingsBtn(message: Message, setting: string, result?: any) {

        this.component.setComponents(
            new MessageButton({
                customId: 'prev_embed',
                style: "SECONDARY",
                emoji: "⬅",
                disabled: this.currentPage === 0
            }),
            new MessageButton({
                customId: 'next_embed',
                style: "SECONDARY",
                emoji: "➡",
                disabled: this.currentPage === this.pages.length - 1
            }),
            new MessageButton({
                customId: result[setting] == true ? `embed_on${setting}` : `embed_off_${setting}`,
                style: result[setting] == true ? "SUCCESS" : "DANGER",
                emoji: result[setting] == true ? "✅" : "❌"
            })
        )
        this.pages[this.currentPage].color = result[setting] == true ? "#ff0000" : "#00ff00"
        this.pages[this.currentPage].author = { name: `${setting}: ${result[setting]}`}
        message.edit(this.generate(this.pages[this.currentPage], message.channel))
        return this.component
    }
}