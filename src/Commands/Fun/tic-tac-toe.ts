import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import * as gradient from 'gradient-string';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, EmbedBuilder, User, GuildMember, GuildListMembersOptions } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import profileSchema from '../../schemas/profileSchema';

export const command: Command = {
    name: "tic-tac-toe",
    description: "play a game of tic tac toe!",
    details: "play a game of tic tac toe!",
    aliases: ["ttt"],
    group: __dirname,
    hidden: false,
    UserPermissions: ["SEND_MESSAGES"],
    ClientPermissions: ["SEND_MESSAGES", "ADD_REACTIONS"],
    ownerOnly: false,
    examples: ["ttt @user"],
    
    run: async(client, message, args) => {
        let msg = '';
        const games: any = {}
        const gamespots: any = [':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:']
        let spots1: any = []
        let transform: any = {
            1: ':one:',
            2: ':two:',
            3: ':three:',
            4: ':four:',
            5: ':five:',
            6: ':six:',
            7: ':seven:',
            8: ':eight:',
            9: ':nine:'
        }
        const { channel, guild, mentions, author } = message
        const member = mentions.users.first()
        if (!member || member === undefined) return message.reply('Please specify your enemy')

        const winning_combinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]



        // Define Player 1 and 2
        const p1 = author.username
        const p2 = member.username

        const spots = [':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:']

        msg = `${spots[0]} ${spots[1]} ${spots[2]}\n${spots[3]} ${spots[4]} ${spots[5]}\n${spots[6]} ${spots[7]} ${spots[8]}`
        
        let embed = new EmbedBuilder()
            .setColor('#ff4300')
            .setTitle(`Tic Tac Toe`)
            .setDescription(`${msg}`)
            .setFooter({ text: 'Write a number to mark your spot' })

        let msgEmbed = await channel.send({ embeds: [embed] })
        
        games[channel.id] = {
            message,
            stage: 'game',
            EmbedBuilder,
            spots: spots,
            gamespots: gamespots,
            p1,
            p2,
            turn: p1
        }
        const filter = (m: any) => m.author.id === author.id || m.author.id === member.id

        if (!channel.isTextBased()) return
        
        const collector = channel.createMessageCollector({
            filter, 
            max: 50,
            time: 60 * 1000,
        });
    
        collector.on('collect', async (m: any) => {
            const { channel, content, member, guild, author } = m
            if (!channel.isText()) return
            if (author.bot) return
            const { id } = channel
            const game: any = games[id]
            if (content === 'end' || content === 'stop') {
                game.stage = 'end'
                return m.reply('stopped game')
            }
            if (!game) return
            if (game.stage == 'end') return
            if (Number.isNaN(content)) return
            if (game.spots.length = 0) return m.reply('Tie!');
            const field = (async (game: any, spot: any) => {
                // 1 2 3
                // 4 5 6
                // 7 8 9
                
                if (spots1[0] == '❌' && spots1[1] == '❌' && spots1[2] == '❌' || 
                    spots1[0] == '❌' && spots1[3] == '❌' && spots1[6] == '❌' || 
                    spots1[1] == '❌' && spots1[4] == '❌' && spots1[7] == '❌' ||
                    spots1[2] == '❌' && spots1[5] == '❌' && spots1[8] == '❌' ||
                    spots1[3] == '❌' && spots1[4] == '❌' && spots1[5] == '❌' ||
                    spots1[6] == '❌' && spots1[7] == '❌' && spots1[8] == '❌' ||
                    spots1[0] == '❌' && spots1[5] == '❌' && spots1[8] == '❌' ||
                    spots1[2] == '❌' && spots1[5] == '❌' && spots1[6] == '❌') {
                    message.delete()
                    game.stage = 'end'
                    return message.reply(`${game.p1} wins!`)
                } else if (spots1[0] == '⭕' && spots1[1] == '⭕' && spots1[2] == '⭕' || 
                    spots1[0] == '⭕' && spots1[3] == '⭕' && spots1[6] == '⭕' || 
                    spots1[1] == '⭕' && spots1[4] == '⭕' && spots1[7] == '⭕' ||
                    spots1[2] == '⭕' && spots1[5] == '⭕' && spots1[8] == '⭕' ||
                    spots1[3] == '⭕' && spots1[4] == '⭕' && spots1[5] == '⭕' ||
                    spots1[6] == '⭕' && spots1[7] == '⭕' && spots1[8] == '⭕' ||
                    spots1[0] == '⭕' && spots1[5] == '⭕' && spots1[8] == '⭕' ||
                    spots1[2] == '⭕' && spots1[5] == '⭕' && spots1[6] == '⭕') {
                    message.delete()
                    game.stage = 'end'

                    return m.reply(`${game.p2} wins!`)
                }
                
                if (game.stage == 'end') return

                if (!game.gamespots.includes(transform[content])) return message.reply('Not correct number');
                if (author.username === game.p1) {
                    if (game.turn === game.p2) return message.reply('it is not your turn')
                    game.turn = game.p2
                    spots1 = game.gamespots
                    spots1.splice(spots1.indexOf(transform[spot]), 1, "❌");
                    msg = `${spots1[0]} ${spots1[1]} ${spots1[2]}\n${spots1[3]} ${spots1[4]} ${spots1[5]}\n${spots1[6]} ${spots1[7]} ${spots1[8]}`
                    let embed2 = new EmbedBuilder()
                        .setColor('#ff4300')
                        .setAuthor({ name: `Turn: ${game.p2}` })
                        .setTitle(`Tic Tac Toe`)
                        .setDescription(`${msg}`)
                        .setFooter({ text: 'Write a number to mark your spot or *end* to stop the game' })

                    channel.send({ embeds: [embed2] })
                    
                    const remove = [`${transform[spot]}`]
                    
                } else if (author.username === game.p2) {
                    if (game.turn === game.p1) return message.reply('it is not your turn')
                    game.turn = game.p1
                    spots1 = game.gamespots
                    
                    spots1.splice(spots1.indexOf(transform[spot]), 1, "⭕");
                    msg = `${spots1[0]} ${spots1[1]} ${spots1[2]}\n${spots1[3]} ${spots1[4]} ${spots1[5]}\n${spots1[6]} ${spots1[7]} ${spots1[8]}`
                    let embed2 = new Discord.EmbedBuilder()
                        .setColor('#ff4300')
                        .setAuthor({ name: `Turn: ${game.p1}` })
                        .setTitle(`Tic Tac Toe`)
                        .setDescription(`${msg}`)
                        .setFooter({ text: 'Write a number to mark your spot' })
                    
                    channel.send({ embeds: [embed2] })

                    const remove = [`${transform[spot]}`]
                    console.log(remove)
                    game.spots = game.spots.filter((item: any) => !remove.includes(item))
                }                
            });
            field(game, content)
        });
        
    
        collector.on('end', (collected, reason) => {
            return 
        });
    }
}