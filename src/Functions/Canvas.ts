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
    grid(posX: number, posY: number, titles: any[], rows: string[][], fontsize?: number) {

        let widths = titles.map(t => this.context.measureText(t).width-10)
        let font = fontsize || 70;
        this.context.textAlign = "left"

        let average = widths.join('').length / widths.length

        do {
            // Assign the font to the context and decrement it so it can be measured again
            this.context.font = `${font -= 10}px sans-serif`;
            // Compare pixel width of the text to the canvas minus the approximate avatar size
        } while (average > (this.canvas.width / titles.length));
        this.context.font = `${font += 5}px sans-serif`;
        titles.forEach((title, i) => {
            this.context.fillText(title, ((this.canvas.width / titles.length) * i) + posX, posY-40);
        })
        rows.forEach(async (row, i) => {
            let offsetY = posY + (i * 43)
            for (let j = 0; j < row.length; j++) {
                if (row[j].includes('./img/')) {
                    let icon = await readFile(row[j])
                    const weathericon = new Image();
                    weathericon.src = icon;
                    this.context.drawImage(weathericon, 250, offsetY - 40);
                    row.splice(j, 1)
                } else {
                    this.context.fillText(row[j], ((this.canvas.width / rows.length) * j) + posX, offsetY);
                }
            }
            // row.forEach(async (text, j) => {    
            //     if (text.includes('./img/')) {
            //         let icon = await readFile(text)
            //         const weathericon = new Image();
            //         weathericon.src = icon;
            //         this.context.drawImage(weathericon, 250, offsetY - 40);
            //         row.splice(j, 1)
            //     } else {
            //         this.context.fillText(text, ((this.canvas.width / rows.length) * j) + posX, offsetY);
            //     }
                
            // })
            console.log(row)
            this.context.beginPath()
            this.context.moveTo(posX, offsetY+10);
            this.context.lineTo(this.canvas.width, offsetY+10);
            this.context.closePath()
            this.context.stroke();
        })
    }
    gen() {
        return this.canvas;
    }
}