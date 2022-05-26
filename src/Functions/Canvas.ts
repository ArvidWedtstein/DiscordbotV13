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
import { Canvas, createCanvas, Image, SKRSContext2D } from '@napi-rs/canvas';
import { readFile } from 'fs/promises'
import { request } from 'undici';
import { i } from "mathjs";
import axios from "axios";

export type Icon = {
    iconPath: string;
    posX: number;
}
export class CustomCanvas {
    public canvas: Canvas;
    public context: SKRSContext2D;
    private defaultFill = "#000000";
    constructor(width: number, height: number)
    {
        this.canvas = createCanvas(width, height)
        this.context = this.canvas.getContext('2d')
    }

    rect(posX: number, posY: number, width: number, height: number, color?: string) {
        this.context.fillStyle = color || this.defaultFill;
        this.context.fillRect(posX, posY, width, height);
        this.context.fillStyle = this.defaultFill;
    }
    text(text: string, posX: number, posY: number, color?: string, font?: string, align?: CanvasTextAlign) {
        this.context.fillStyle = color || this.defaultFill;
        this.context.font = font || "12px Arial";

        this.context.textAlign = align || "left";
        this.context.fillText(text, posX, posY);
    }
    async image(URLpath: string, posX: number, posY: number, size?: number) {
        let icon: any = URLpath;

        const img = new Image();

        if (URLpath.startsWith("./")) {
            try {
                icon = await readFile(URLpath)

                img.src = icon;
            } catch (err) {
                console.log(err)
            }
        } else {
            let { data } = await axios.get(icon)
            // const { body } = await request('https://cdn.discordapp.com/avatars/320137922370338818/07647c028203bcc3c7ba9c7c38f96a2e.jpg');
            img.src = Buffer.from(data);
        }
        
        this.context.drawImage(img, 25, 25, 200, 200);
    }   
    grid(posX: number, posY: number, rows: string[][], fontsize?: number, icons?: Icon[]) {

        let widths = rows[0].map(t => this.context.measureText(t).width-10)
        let font = fontsize || 70;
        this.context.textAlign = "left"

        let average = widths.join('').length / widths.length

        do {
            // Assign the font to the context and decrement it so it can be measured again
            this.context.font = `${font -= 10}px sans-serif`;
            // Compare pixel width of the text to the canvas minus the approximate avatar size
        } while (average > (this.canvas.width / rows[0].length));
        this.context.font = `${font + 5}px sans-serif`;

        rows.forEach(async (row, i) => {
            let offsetY = posY + (i * 43)
            this.context.beginPath()
            this.context.moveTo(posX, offsetY+10);
            this.context.lineTo(this.canvas.width-posX, offsetY+10);
            this.context.closePath()
            this.context.stroke();
            this.context.font = i === 0 ? `${font + 10}px sans-serif` : `${font + 5}px sans-serif`;
            for (let j = 0; j < row.length; j++) {
                this.context.fillText(row[j], ((this.canvas.width / row.length) * j) + posX, offsetY);
            }
            if (icons && icons[i] && i !== 0) {
                let icon = await readFile(icons[i].iconPath)
                const weathericon = new Image();
                weathericon.src = icon;
                this.context.drawImage(weathericon, icons[i].posX, offsetY - 40);
            }
            
        })
    }
    applyText = (canvas: any, text: any) => {
        const context = canvas.getContext('2d');

        // Declare a base size of the font
        let fontSize = 70;

        do {
            // Assign the font to the context and decrement it so it can be measured again
            context.font = `${fontSize -= 10}px sans-serif`;
            // Compare pixel width of the text to the canvas minus the approximate avatar size
        } while (context.measureText(text).width > canvas.width - 300);

        // Return the result to use in the actual canvas
        return context.font;
    };
    gen() {
        return this.canvas;
    }
}