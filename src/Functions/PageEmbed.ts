import { 
    EmbedBuilder, 
    EmbedAuthorData, 
    EmbedField, 
    EmbedFooterData, 
    ColorResolvable, 
    EmbedImageData,
    GuildEmoji, 
    TextChannel, 
    PartialDMChannel, 
    DMChannel, 
    NewsChannel, 
    ThreadChannel, 
    ReactionEmoji,
    Message,
    Interaction,
    Guild,
    AttachmentBuilder,
    MessageActionRowComponent,
    MessageActionRowComponentResolvable,
    ActionRowBuilder,
    SelectMenuBuilder,
    ButtonBuilder,
    SelectMenuOptionBuilder,
    SelectMenuComponentData,
    MessageEditOptions,
} from "discord.js";
import settingsSchema from "../schemas/settingsSchema";
import { Canvas } from "@napi-rs/canvas";
import { MessageOptions } from "child_process";


export interface PageEmbedOptions {
    title?: string;
    description?: string;
    url?: string;
    timestamp?: Date | number;
    color?: ColorResolvable;
    fields?: EmbedField[];
    author?: EmbedAuthorData
    thumbnail?: EmbedImageData;
    image?: EmbedImageData;
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
    selectMenuItemID?: string;
}

export interface PageEmbedSettings {
    pages?: PageEmbedOptions[];
    selectMenu?: SelectMenuOptionBuilder | null;
    timeout?: number;
}

export class PageEmbed {
    constructor(data?: any)
    // constructor(pages: PageEmbedOptions[])
    {
        this.pages = data?.pages || [];
        this.selectMenu = data?.selectMenu ? new ActionRowBuilder({ components: [
            new SelectMenuBuilder(data.selectMenu)
        ]}) : null;
        this.currentPage = 0;
        this.component = new ActionRowBuilder();
    }
    private pages: PageEmbedOptions[];
    private currentPage: number;
    private component: ActionRowBuilder;
    private settings: any;
    private selectMenu: any | null;

    public addPage(page: PageEmbedOptions): this {
        this.pages.push(page);
        return this
    };
    public addPages(pages: PageEmbedOptions[]): this {
        this.pages = pages;
        return this
    };
    public addSelectMenu(options: SelectMenuComponentData): this {
        this.selectMenu = new ActionRowBuilder({ components: [
            new SelectMenuBuilder(options)
        ]});

        return this
    };
    public setPage(page: number): this {
        this.currentPage = page;
        return this
    };
    private generate(page: any, disable: boolean = false) {
        
        // Update the footer text to the new page number
        if (!page.canvas) {
            page.footer = {text: `Page ${this.currentPage+1} of ${this.pages.length}`} 
            page.image = { url: `attachment://banner.gif` }
        }

        page.settings ? this.getRow(disable, page.settings.type) : this.getRow(disable)
        this.selectMenu ? this.selectMenu?.components.every((c: any) => c.setDisabled(disable)) : null
        // this.selectMenu || this.component,
        const attachment = new AttachmentBuilder('./img/banner.gif');
        let components = [this.component];
        this.selectMenu ? components.push(this.selectMenu) : null
        let d: any = { 
            embeds: page.canvas ? [] : [new EmbedBuilder(page)], 
            components: components,
            files: page.canvas ? [new AttachmentBuilder(page.canvas.toBuffer('image/png'))] : [attachment]
        }
        return d
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

    
        const EmbedBuilder = channel.send(this.generate(page)).then(async (m) => {

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

                    await m.edit(this.generate(page))
                    return
                }

                if (reaction.isSelectMenu() && page.selectMenuItemID && this.pages.some(x => x.selectMenuItemID === reaction.values[0])) {
                    if (this.pages.filter(x => x.selectMenuItemID === reaction.values[0]).length > 1) throw new Error('Multiple pages with the same select menu item ID is not allowed');
                    this.currentPage = this.pages.findIndex(p => p.selectMenuItemID === reaction.values[0])
                    page = this.pages[this.currentPage]
                    await m.edit(this.generate(page))
                    return
                }

                if (reaction.customId === 'embed_save_and_close') {
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
            
                await m.edit(this.generate(page))
            })

            // When collector has finished, then update guilds settings
            collector.on('end', async (reaction) => {
                if (this.pages.some(pag => pag.settings)) {

                    this.save(guildId);
                }
                // Disable buttons
                m.edit(this.generate(page, true))
                return
            })
        })     
    }
    private getRow(disabled: boolean = false, setting?: string) {
        this.component.setComponents(
            new ButtonBuilder({
                customId: 'prev_embed',
                style: 2,
                emoji: "⬅",
                disabled: !disabled ? this.currentPage === 0 : disabled
            }),
            new ButtonBuilder({
                customId: 'next_embed',
                style: 2,
                emoji: "➡",
                disabled: !disabled ? this.currentPage === this.pages.length - 1 : disabled
            })
        )
        if (setting) {
            this.component.addComponents(
                new ButtonBuilder({
                    customId: `embed_save_and_close`,
                    style: 2,
                    emoji: "💾",
                    disabled: disabled
                }),
                new ButtonBuilder({
                    customId: this.settings[setting] == true ? `embed_on_${setting}` : `embed_off_${setting}`,
                    style: this.settings[setting] == true ? 3 : 4,
                    emoji: this.settings[setting] == true ? "✅" : "❌",
                    disabled: disabled
                })
            )
            this.pages[this.currentPage].color = this.settings[setting] == true ? "#00ff00" : "#ff0000"
            this.pages[this.currentPage].author = { name: `${setting}: ${this.settings[setting]}`}
        }
        return;
    }
    private async save(guildId: string) {
        let updates: any = {};
        let lap = this.pages.filter(pag => pag.settings)
        let s = lap.map(x => x.settings?.type ? x.settings.type : '')
        for (let i = 0; i < s.length; i++) {
            updates[s[i]] = this.settings[s[i]]
        }

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
            new ButtonBuilder({
                customId: 'prev_embed',
                style: 2,
                emoji: "⬅",
                disabled: !disabled ? this.currentPage === 0 : disabled
            }),
            new ButtonBuilder({
                customId: 'next_embed',
                style: 2,
                emoji: "➡",
                disabled: !disabled ? this.currentPage === this.pages.length - 1 : disabled
            }),
            new ButtonBuilder({
                customId: `embed_save_and_close`,
                style: 2,
                emoji: "💾",
                disabled: disabled
            }),
            new ButtonBuilder({
                customId: this.settings[setting] == true ? `embed_on_${setting}` : `embed_off_${setting}`,
                style: this.settings[setting] == true ? 3 : 4,
                emoji: this.settings[setting] == true ? "✅" : "❌",
                disabled: disabled
            })
        )
        this.pages[this.currentPage].color = this.settings[setting] == true ? "#00ff00" : "#ff0000"
        this.pages[this.currentPage].author = { name: `${setting}: ${this.settings[setting]}`}
        return
    }
}