import { Command } from '../../Interfaces';
import { Settings } from '../../Functions/settings';
import language from '../../Functions/language';
import { addCoins, setCoins, getCoins, getColor } from '../../Functions/economy';
import Discord, { Client, Constants, Collection, ActionRowBuilder, ButtonBuilder, EmbedBuilder } from 'discord.js';
import temporaryMessage from '../../Functions/temporary-message';
import moment from 'moment';
import icon from '../../Functions/icon';
import { bool } from 'sharp';
import { Console } from 'console';

export const command: Command = {
    name: "arkdinowordsolver",
    description: "arkdinowordsolver",
    details: "arkdinowordsolver",
    aliases: ["arkdinowordsolver"],
    group: "Fun",
    hidden: false,
    UserPermissions: ["SendMessages"],
    ClientPermissions: ["SendMessages", "AddReactions"],
    ownerOnly: false,
    examples: ["arkdinowordsolver <scrambled word>"],
    
    run: async(client, message, args) => {
        const { guild, channel, author, member, mentions, attachments } = message;
        if (!guild) return
        
        const word = args[0];
        if (!word) return channel.send("Please provide a word to solve");

        function sameLetters(str1: string, str2: string) {
            if(str1.length !== str2.length) return false;
            
            const obj1: any = {}
            const obj2: any = {}
            
            for(const letter of str1) {
                obj1[letter] = (obj1[letter] || 1) + 1
            } 
            for(const letter of str2) {
                obj2[letter] = (obj2[letter] || 1) + 1
            }
            
            for(const key in obj1) {
                if(!obj2.hasOwnProperty(key)) return false
                if(obj1[key] !== obj2[key]) return false
            }
            return true
        }

        Object.keys(ArkDinos).map((dino) => dino.toUpperCase()).forEach((dino) => {
            if (sameLetters(dino, word)) {
                let embed = new EmbedBuilder()
                    .setColor(client.config.botEmbedHex)
                    .setTitle("Ark Dino Word Solver")
                    .setDescription(`The word \`${word}\` is \`${dino.toLowerCase()}\``)
                    .setFooter({ text: `Word solving requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
                return channel.send({ embeds: [embed] })
            }
        })
    }
}


enum ArkDinos {
    "Ankylosaurus" = "Ankylosaurus",
    "Argentavis" = "Argentavis",
    "Arthropluera" = "Arthropluera",
    "Baryonyx" = "Baryonyx",
    "Beelzebufo" = "Beelzebufo",
    "Brontosaurus" = "Brontosaurus",
    "Carbonemys" = "Carbonemys",
    "Castoroides" = "Castoroides",
    "Carnotaurus" = "Carnotaurus",
    "Compy" = "Compy",
    "Daeodon" = "Daeodon",
    "Dilophosaurus" = "Dilophosaurus",
    "Dimetrodon" = "Dimetrodon",
    "Diplocaulus" = "Diplocaulus",
    "Diplodocus" = "Diplodocus",
    "Doedicurus" = "Doedicurus",
    "Dodo" = "Dodo",
    "Dung Beetle" = "Dung Beetle",
    "Equus" = "Equus",
    "Gallimimus" = "Gallimimus",
    "Giganotosaurus" = "Giganotosaurus",
    "Gigantopithecus" = "Gigantopithecus",
    "Glowtail" = "Glowtail",
    "Dragon" = "Dragon",
    "Gryphon" = "Gryphon",
    "Hesperornis" = "Hesperornis",
    "Ichthyornis" = "Ichthyornis",
    "Iguanodon" = "Iguanodon",
    "Kairuku" = "Kairuku",
    "Karkinos" = "Karkinos",
    "Kaprosuchus" = "Kaprosuchus",
    "Megachelon" = "Megachelon",
    "Megalania" = "Megalania",
    "Megaloceros" = "Megaloceros",
    "Megalodon" = "Megalodon",
    "Megatherium" = "Megatherium",
    "Moschops" = "Moschops",
    "Oviraptor" = "Oviraptor",
    "Paraceratherium" = "Paraceratherium",
    "Pegomastax" = "Pegomastax",
    "Plesiosaur" = "Plesiosaur",
    "Parasaur" = "Parasaur",
    "Polar Bear" = "Polar Bear",
    "Procoptodon" = "Procoptodon",
    "Pteranodon" = "Pteranodon",
    "Pulmonoscorpius" = "Pulmonoscorpius",
    "Quetzal" = "Quetzal",
    "Raptor" = "Raptor",
    "Rex" = "Rex",
    "Rock Drake" = "Rock Drake",
    "Sabertooth" = "Sabertooth",
    "Sarco" = "Sarco",
    "Sarcosuchus" = "Sarcosuchus",
    "Spino" = "Spino",
    "Stegosaurus" = "Stegosaurus",
    "Therizinosaurus" = "Therizinosaurus",
    "Thorny Dragon" = "Thorny Dragon",
    "Titanoboa" = "Titanoboa",
    "Titanosaur" = "Titanosaur",
    "Triceratops" = "Triceratops",
    "Troodon" = "Troodon",
    "Tusoteuthis" = "Tusoteuthis",
    "Tyrannosaurus" = "Tyrannosaurus",
    "Velonasaur" = "Velonasaur",
    "Woolly Rhino" = "Woolly Rhino",
    "Wyvern" = "Wyvern",
    "Yutyrannus" = "Yutyrannus",
    "Ankylo" = "Ankylosaurus",
    "Desmodus" = "Desmodus",
    "Fenrir" = "Fenrir",
    "Araneo" = "Araneo",
    "Gacha" = "Gacha",
    "Mantis" = "Mantis",
    "Megalosaurus" = "Megalosaurus",
    "Ovis" = "Ovis",
    "Pachy" = "Pachy",
    "Pachyrhinosaurus" = "Pachyrhinosaurus",
    "Purlovia" = "Purlovia",
    "Scout" = "Scout",
    "Bulbdog" = "Bulbdog",
    "Cnidaria" = "Cnidaria",
    "Dunkleosteus" = "Dunkleosteus",
    "Eurypterid" = "Eurypterid",
    "Ichthyosaurus" = "Ichthyosaurus",
    "Liopleurodon" = "Liopleurodon",
    "Lystrosaurus" = "Lystrosaurus",
    "Mammoth" = "Mammoth",
    "Manta" = "Manta",
    "Mosasaurus" = "Mosasaurus",
    "Onyc" = "Onyc",
    "Pachycephalosaurus" = "Pachycephalosaurus",
    "Astrocetus" = "Astrocetus",
    "Basilosaurus" = "Basilosaurus",
    "Astrodelphis" = "Astrodelphis",
    "Fjordhawk" = "Fjordhawk",
    "Featherlight" = "Featherlight",
    "Gasbags" = "Gasbags",
    "Dimorphodon" = "Dimorphodon",
    "Snow Owl" = "Snow Owl",
    "Sinomacrops" = "Sinomacrops",
    "Phoenix" = "Phoenix",
    "Tapejara" = "Tapejara",
    "Titanomyrma" = "Titanomyrma",
    "Pelagornis" = "Pelagornis",
    "Griffin" = "Griffin",
    "Vulture" = "Vulture",
    "Angler" = "Angler",
    "Electrophorus" = "Electrophorus",
    "Piranha" = "Piranha",
    "Otter" = "Otter",
    "Ichtyosaurus" = "Ichtyosaurus",
    "Trilobite" = "Trilobite",
    "Leedsichthys" = "Leedsichthys",
    "Lamprey" = "Lamprey",
    "Ammonite" = "Ammonite",
    "Amargasaurus" = "Amargasaurus",
    "Allosaurus" = "Allosaurus",
    "Achatina" = "Achatina",
    "Andrewsarchus" = "Andrewsarchus",
    "Beezlebufo" = "Beezlebufo",
    "Bloodstalker" = "Bloodstalker",
    "Dilophosaur" = "Dilophosaur",
    "Enforcer" = "Enforcer",
    "Giant Bee" = "Giant Bee",
    "Chalicotherium" = "Chalicotherium",
    "Deinonychus" = "Deinonychus",
    "Dinopithecus" = "Dinopithecus",
    "Jerboa" = "Jerboa",
    "Hyaenodon" = "Hyaenodon",
    "Ferox" = "Ferox",
    "Direbear" = "Direbear",
    "Kentrosaurus" = "Kentrosaurus",
    "Maewing" = "Maewing",
    "Nameless" = "Nameless",
    "Phiomia" = "Phiomia",
    "Sabertooth Salmon" = "Sabertooth Salmon",
    "Spinosaur" = "Spinosaur",
    "Shinehorn" = "Shinehorn",
    "Thylacoleo" = "Thylacoleo",
    "Rollrat" = "Rollrat",
    "Terrorbird" = "Terrorbird",
    "Reaper" = "Reaper",
    "Seeker" = "Seeker",
    "Shadowmane" = "Shadowmane",
    "Ravager" = "Ravager",
    "Rockelemental" = "Rockelemental",
    "Therezinosaurus" = "Therezinosaurus",
    "Unicorn" = "Unicorn",
    "Yeti" = "Yeti",
    "Deathworm" = "Deathworm",
    "Mesopithecus" = "Mesopithecus",
    "Mek" = "Mek",
    "Morellatops" = "Morellatops",
    "Noglin" = "Noglin",
    "Leech" = "Leech",
    "Moeder" = "Moeder",
    "Voidwyrm" = "Voidwyrm",
    "Lymantria" = "Lymantria",
    "Archaeopteryx" = "Archaeopteryx",
}

