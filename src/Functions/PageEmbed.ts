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
    MessageAttachment
} from "discord.js";
import settingsSchema from "../schemas/settingsSchema";


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
    }
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
    private generate(page: PageEmbedOptions) {
        // Update the footer text to the new page number
        page.footer = {text: `Page ${this.currentPage}`} 
        return new MessageEmbed(page)
    }
    async post(message: Message) {
        const { channel, author, guild } = message
        if (!guild) return

        const guildId = guild.id;

        let page = this.pages[this.currentPage];
        
        const row = this.getRow() || this.component;

        let result: any;

        // If settings is specified on one of the pages, then we need to get the settings from the database
        if (this.pages.some(pag => pag.settings)) {
            result = await settingsSchema.findOne({ guildId });

            if (!result) {
                result = new settingsSchema({ guildId }).save()
            }
        }


        const attachment = new MessageAttachment('./img/banner.jpg', 'banner.jpg');
        page.image = { url: `attachment://banner.jpg` }

        const msg = channel.send({ 
            embeds: [this.generate(page)], 
            components: [row],
            files: [attachment]
        }).then(async (m) => {

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
                max: 10000,
                time: 5 * 1000 * 60
            })

            
            collector.on('collect', async (reaction) => {
                if (!reaction) return;

                reaction.deferUpdate();

                // Check if setting has been toggled
                if (page.settings && reaction.customId === `embed_on_${page.settings.type}` || page.settings && reaction.customId === `embed_off_${page.settings.type}`) {

                    result[page.settings.type] = !result[page.settings.type] // Toggle the setting

                    await this.settingsBtn(m, page.settings.type, result)
                    await m.edit({
                        embeds: [this.generate(page)], 
                        components: [await this.component]
                    })
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

                    m.edit({ 
                        embeds: [this.generate(page)], 
                        components: [await this.component]
                    })
                    return
                }

                await m.edit({ 
                    embeds: [this.generate(page)], 
                    components: [await this.component]
                })
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
                return
            })
        })     
    }
    private getRow() {
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
        message.edit({embeds: [this.pages[this.currentPage]], components: [await this.component]})
        return this.component
    }
}
