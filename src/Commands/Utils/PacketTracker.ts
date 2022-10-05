import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder, Interaction, AttachmentBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import { addXP } from '../../Functions/Level';
import profileSchema from '../../schemas/profileSchema';
import { ErrorEmbed } from '../../Functions/ErrorEmbed';
import { PageEmbed, PageEmbedOptions } from '../../Functions/PageEmbed';
import axios from 'axios';
import moment from 'moment';
export const command: Command = {
    name: "packettracker",
    description: "Get info about a packet",
    details: "Get information about a packet",
    aliases: ["packet", "packettracking"],
    hidden: true,
    UserPermissions: ["Administrator"],
    ClientPermissions: ["SendMessages", "AddReactions", "EmbedLinks"],
    ownerOnly: true,
    examples: ["packettracker {code}"],
    run: async(client, message, args) => {
        const { guild, channel, author } = message;
        if (!guild) return;

        const code = args[0];
        if (!code) return ErrorEmbed(message, client, command, "Please provide a code to track");
        message.delete();

        let { data } = await axios.get(`https://api.bring.com/tracking/api/v2/tracking.json?q=${code}`, {
            headers: {
                "X-Mybring-API-Key": process.env.BRING_API_KEY || '',
                "X-Mybring-API-Uid": process.env.BRING_API_UID || '',
                "X-Bring-Client-URL": "https://www.bring.com/",
            }
        });
        

        enum BringStatus {
            "CUSTOMS" = "Customs",
            "COLLECTED" = "Collected",
            "DELIVERED" = "Delivered",
            "DELIVERED_SENDER" = "Delivered to sender",
            "DELIVERY_CANCELLED" = "Delivery cancelled",
            "DELIVERY_CHANGED" = "Date for Home delivery has been changed by customer.",
            "DELIVERY_ORDERED" = "Home delivery has been ordered",
            "DEVIATION" = "Deviation in production. Something wrong has happened and there is a probability for delay.",
            "HANDED_IN" = "Package has been handed in to Bring.",
            "INTERNATIONAL" = "Package has been sent from origin country or arrived at destination country.",
            "IN_TRANSIT" = "Package is in transit",
            "NOTIFICATION_SENT" = "Notification for this package has been sent by sms, push and/or mail.",
            "PRE_NOTIFIED" = "EDI message for the package has been received by Bring.",
            "READY_FOR_PICKUP" = "Package is ready for pickup",
            "RETURN" = "The package has been returned to sender.",
            "TRANSPORT_TO_RECIPIENT" = "Package has been loaded for delivery to the recipient.",
            "TERMINAL" = "The package is now registered/arrived at inbound/outbound storage terminal",
            "UNKNOWN" = "Unknown"
        }

        type BringStatusType = Partial<keyof typeof BringStatus>;

        let {
            packageNumber,
            productName,
            lengthInCm,
            widthInCm,
            heightInCm,
            weightInKgs,
            eventSet,
            dateOfEstimatedDelivery,
        } = data.consignmentSet[0].packageSet[0];

        
        let status: BringStatusType = eventSet[0].status; 
        const pages: PageEmbedOptions[] = [
            {
                color: client.config.botEmbedHex,
                title: `Packet Tracking`,
                description: [
                    `**PackageNr:** ${packageNumber}`,
                    `-------------`,
                    `**Product:** ${productName}`,
                    `**Size:** ${lengthInCm} x ${widthInCm} x ${heightInCm}`,
                    `**Weight:** ${weightInKgs}kg`,
                    `-------------`,
                    `**Last Event:**`,
                    `${eventSet[0].description}`,
                    `${BringStatus[status]}`,
                    `${moment(eventSet[0].dateIso).fromNow()}`,
                    `-------------`,
                    `**Estimated Delivery:** ${moment(dateOfEstimatedDelivery).toNow()}`,
                ].join('\n'),
                timestamp: new Date(),
            },
        ]
        const t = new PageEmbed({ pages: pages });

        return await t.post(message)
    }
}
