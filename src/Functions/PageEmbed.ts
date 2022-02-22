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
    Guild
} from "discord.js";
import settingsSchema from "../schemas/settingsSchema";


export class PageEmbed {
    public pages: any[];
    private currentPage: number;
    private component: MessageActionRow;
    constructor(pages: any[])
    {
        this.pages = pages
        this.currentPage = 0;
        this.component = new MessageActionRow()
    }
    async post(message: Message, toggleIcons?: any[]) {
        
        this.pages[this.currentPage].footer = {text: `Page ${this.currentPage}`}
        let reactions = this.pages[this.currentPage].reactions;
        const row = this.getRow() || this.component;
        const msg = message.channel.send({embeds: [this.pages[this.currentPage]], components: [row]}).then(async (m) => {
            if (await Object.values(reactions).length > 0) {
                for (let i = 0; i < Object.values(reactions).length; i++) {
                    let emoji: any = Object.values(reactions)[i];
                    m.react(emoji)
                }
                const filter = (i: Interaction) => i.user.id === message.author.id;
                const collector = m.createMessageComponentCollector({
                    filter,
                    max: 10000,
                    time: 1000 * 60
                })

                const guildId = message?.guild?.id;
                let result = await settingsSchema.findOne({
                    guildId
                })
                if (!result) {
                    result = await new settingsSchema({
                        guildId
                    }).save()
                }
                collector.on('collect', async (reaction) => {
                    if (!reaction) return;

                    reaction.deferUpdate();
                    
                    if (reaction.customId === 'prev_embed') {// page left
                        if (this.currentPage <= 0) this.currentPage = this.pages.length-1
                        this.currentPage -= 1;
                        this.pages[this.currentPage].footer = {text: `Page ${this.currentPage}`}

                        this.getRow();

                        if (this.pages[this.currentPage].settings != null) {
                            this.settingsBtn(m, this.pages[this.currentPage].settings.type, result)
                            m.edit({embeds: [this.pages[this.currentPage]], components: [await this.component]})
                        } else {
                            await m.edit({embeds: [this.pages[this.currentPage]], components: [await this.component]})
                        }
                        
                        await m.edit({embeds: [this.pages[this.currentPage]], components: [await this.component]})
                    } else if (reaction.customId === 'next_embed') { // page left
                        if (this.currentPage >= this.pages.length-1) this.currentPage = - 1
                        this.currentPage += 1;
                        this.pages[this.currentPage].footer = {text: `Page ${this.currentPage}`}

                        this.getRow();
                        
                        if (this.pages[this.currentPage].settings != null) {
                            this.settingsBtn(m, this.pages[this.currentPage].settings.type, result)
                            m.edit({embeds: [this.pages[this.currentPage]], components: [await this.component]})
                        } else {
                            await m.edit({embeds: [this.pages[this.currentPage]], components: [await this.component]})
                        }
                    } else if (reaction.customId === `embed_on_${this.pages[this.currentPage].settings.type}` || `embed_off_${this.pages[this.currentPage].settings.type}`) {
                        const guildId = message?.guild?.id;
                        result[this.pages[this.currentPage].settings.type] = !result[this.pages[this.currentPage].settings.type]

                        await this.settingsBtn(m, this.pages[this.currentPage].settings.type, result)
                        await m.edit({embeds: [this.pages[this.currentPage]], components: [await this.component]})
                    }
                })
                collector.on('end', async (reaction) => {
                    result = await settingsSchema.findOneAndUpdate(
                        {
                            guildId,
                        }, {
                            result
                        }, {
                            upsert: true
                        }
                    )
                })
            }
        })     
    }
    getRow() {
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
    
    async settingsBtn(message: Message, setting: string, result?: any) {

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
        this.pages[this.currentPage].author = {name: `${setting}: ${result[setting]}`}
        message.edit({embeds: [this.pages[this.currentPage]], components: [await this.component]})
        return this.component
    }
}
