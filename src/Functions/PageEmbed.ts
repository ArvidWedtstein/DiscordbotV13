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
    ReactionEmoji
} from "discord.js";

export class PageEmbed {
    public title?: string;
    public description?: string;
    public fields?: EmbedFieldData[];
    public author?: EmbedAuthorData;
    public footer?: EmbedFooterData;
    public image?: MessageEmbedImage;
    public thumbnail?: MessageEmbedThumbnail;
    public color?: ColorResolvable;
    public embed: MessageEmbed;
    // constructor(
    //     channel: DMChannel | PartialDMChannel | NewsChannel | TextChannel | ThreadChannel,
    //     title?: string, 
    //     description?: string, 
    //     fields?: EmbedFieldData[], 
    //     author?: EmbedAuthorData, 
    //     footer?: EmbedFooterData,
    //     image?: MessageEmbedImage,
    //     thumbnail?: MessageEmbedThumbnail,
    //     color?: ColorResolvable,
    //     reactions?: GuildEmoji[],
    // ) 
    constructor({
        title = "",
        description = "",
        fields = [],
        image = undefined,
        thumbnail = undefined,
        color = undefined,
        author = {name: "", iconURL: ""},
        footer = {text: "", iconURL: ""}
    })
    {
        this.title = title;
        this.description = description;
        this.fields = fields;
        this.author = author;
        this.footer = footer;
        this.image = image;
        this.thumbnail = thumbnail;
        this.color = color;
        this.embed = new MessageEmbed({
            title: title,
            description: description,
            fields: fields,
            author: author,
            footer: footer,
            image: image,
            thumbnail: thumbnail,
            color: color
        });
    }
    post(channel: DMChannel | PartialDMChannel | NewsChannel | TextChannel | ThreadChannel, reactions?: GuildEmoji[]) {
        const msg = channel.send({embeds: [this.embed]}).then(async (m) => {
            if (reactions && reactions?.length > 0) {
                reactions?.forEach(async(emoji) => {
                    m.react(emoji);
                })
            }
        })        
    }
}
