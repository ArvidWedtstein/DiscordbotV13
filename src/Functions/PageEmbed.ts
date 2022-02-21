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
    Message
} from "discord.js";
import internal from "stream";

export class PageEmbed {
    public pages: any[];
    private currentPage: number;
    constructor(pages: any[])
    {
        this.pages = pages
        this.currentPage = 0;
    }
    async post(message: Message, toggleIcons?: any[]) {
        
        this.pages[this.currentPage].footer = {text: `Page ${this.currentPage}`}
        let reactions = this.pages[this.currentPage].reactions;
        const msg = message.channel.send({embeds: [this.pages[this.currentPage]]}).then(async (m) => {
            if (await Object.values(reactions).length > 0) {
                for (let i = 0; i < Object.values(reactions).length; i++) {
                    let emoji: any = Object.values(reactions)[i];
                    m.react(emoji)
                }
                const filter = (reaction: any, user: any) => {
                    return user.id === message.author.id
                }
                const collector = m.createReactionCollector({
                    filter,
                    max: 10000,
                    time: 1000 * 60
                })

                collector.on('collect', async (reaction, reactionCollector) => {
                    if (!Object.values(reactions).some((e: any) => e.id === reaction.emoji.id)) return;

                    reaction.users.remove(message.author.id);
                    
                    if (reaction.emoji.id === this.pages[this.currentPage].reactions["left"].id) { // page left
                        if (this.currentPage <= 0) this.currentPage = this.pages.length-1
                        this.currentPage -= 1;
                        this.pages[this.currentPage].footer = {text: `Page ${this.currentPage}`}
                        m.edit({embeds: [this.pages[this.currentPage]]})
                    }
                    if (reaction.emoji.id === this.pages[this.currentPage].reactions["right"].id) { // page right
                        if (this.currentPage >= this.pages.length-1) this.currentPage = -1
                        this.currentPage += 1;
                        this.pages[this.currentPage].footer = {text: `Page ${this.currentPage}`}
                        m.edit({embeds: [this.pages[this.currentPage]]})
                    }
                    if (this.pages[this.currentPage].settings != null && toggleIcons) {
                        for (let i = 0; i < toggleIcons.length; i++) {
                            let emoji: any = toggleIcons[i];
                            m.react(emoji)
                        }
                    } else if (toggleIcons) {
                        for (let i = 0; i < toggleIcons.length; i++) {
                            let emoji: any = toggleIcons[i];
                            let client: any = reaction.client.user
                            reaction.message.reactions.resolve(emoji).users.remove(client);
                        }
                    }
                })
            }
        })     
    }
}
