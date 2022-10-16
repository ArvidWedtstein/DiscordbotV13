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
    aliases: ["arkdinowordsolver", "dino", "arkdino"],
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
        let wordFound = false;
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
                wordFound = true
                let embed = new EmbedBuilder()
                    .setColor(client.config.botEmbedHex)
                    .setTitle("Ark Dino Word Solver")
                    .setDescription(`The word \`${word}\` is \`${dino.toLowerCase()}\``)
                    .setFooter({ text: `Word solving requested by ${author.tag}`, iconURL: author.displayAvatarURL() })
                return channel.send({ embeds: [embed] })
            }
        })

        if (!wordFound) return channel.send("Could not find a word that matches the letters provided");
    }
}


enum ArkDinos {
    "Achatina" = "Achatina",
    "Allosaurus" = "Allosaurus",
    "Amargasaurus" = "Amargasaurus",
    "Ammonite" = "Ammonite",
    "Andrewsarchus" = "Andrewsarchus",
    "Angler" = "Angler",
    "Ankylosaurus" = "Ankylosaurus",
    "Araneo" = "Araneo",
    "Archaeopteryx" = "Archaeopteryx",
    "Argentavis" = "Argentavis",
    "Arthropluera" = "Arthropluera",
    "Astrocetus" = "Astrocetus",
    "Astrodelphis" = "Astrodelphis",
    "Baryonyx" = "Baryonyx",
    "Basilosaurus" = "Basilosaurus",
    "Beelzebufo" = "Beelzebufo",
    "Beezlebufo" = "Beezlebufo",
    "Bloodstalker" = "Bloodstalker",
    "Brontosaurus" = "Brontosaurus",
    "Bulbdog" = "Bulbdog",
    "Carbonemys" = "Carbonemys",
    "Carnotaurus" = "Carnotaurus",
    "Castoroides" = "Castoroides",
    "Chalicotherium" = "Chalicotherium",
    "Cnidaria" = "Cnidaria",
    "Compy" = "Compy",
    "Daeodon" = "Daeodon",
    "Deathworm" = "Deathworm",
    "Deinonychus" = "Deinonychus",
    "Desmodus" = "Desmodus",
    "Dilophosaur" = "Dilophosaur",
    "Dilophosaurus" = "Dilophosaurus",
    "Dimetrodon" = "Dimetrodon",
    "Dimorphodon" = "Dimorphodon",
    "Dinopithecus" = "Dinopithecus",
    "Diplocaulus" = "Diplocaulus",
    "Diplodocus" = "Diplodocus",
    "Direbear" = "Direbear",
    "Dodo" = "Dodo",
    "Doedicurus" = "Doedicurus",
    "Dragon" = "Dragon",
    "Dung Beetle" = "Dung Beetle",
    "Dunkleosteus" = "Dunkleosteus",
    "Electrophorus" = "Electrophorus",
    "Enforcer" = "Enforcer",
    "Equus" = "Equus",
    "Eurypterid" = "Eurypterid",
    "Featherlight" = "Featherlight",
    "Fenrir" = "Fenrir",
    "Ferox" = "Ferox",
    "Fjordhawk" = "Fjordhawk",
    "Gacha" = "Gacha",
    "Gallimimus" = "Gallimimus",
    "Gasbags" = "Gasbags",
    "Giant Bee" = "Giant Bee",
    "Giganotosaurus" = "Giganotosaurus",
    "Gigantopithecus" = "Gigantopithecus",
    "Glowtail" = "Glowtail",
    "Griffin" = "Griffin",
    "Gryphon" = "Gryphon",
    "Hesperornis" = "Hesperornis",
    "Hyaenodon" = "Hyaenodon",
    "Ichthyornis" = "Ichthyornis",
    "Ichthyosaurus" = "Ichthyosaurus",
    "Ichtyosaurus" = "Ichtyosaurus",
    "Iguanodon" = "Iguanodon",
    "Jerboa" = "Jerboa",
    "Kairuku" = "Kairuku",
    "Kaprosuchus" = "Kaprosuchus",
    "Karkinos" = "Karkinos",
    "Kentrosaurus" = "Kentrosaurus",
    "Lamprey" = "Lamprey",
    "Leech" = "Leech",
    "Leedsichthys" = "Leedsichthys",
    "Liopleurodon" = "Liopleurodon",
    "Lymantria" = "Lymantria",
    "Lystrosaurus" = "Lystrosaurus",
    "Maewing" = "Maewing",
    "Mammoth" = "Mammoth",
    "Manta" = "Manta",
    "Mantis" = "Mantis",
    "Megachelon" = "Megachelon",
    "Megalania" = "Megalania",
    "Megaloceros" = "Megaloceros",
    "Megalodon" = "Megalodon",
    "Megalosaurus" = "Megalosaurus",
    "Megatherium" = "Megatherium",
    "Mek" = "Mek",
    "Mesopithecus" = "Mesopithecus",
    "Moeder" = "Moeder",
    "Morellatops" = "Morellatops",
    "Mosasaurus" = "Mosasaurus",
    "Moschops" = "Moschops",
    "Nameless" = "Nameless",
    "Noglin" = "Noglin",
    "Onyc" = "Onyc",
    "Otter" = "Otter",
    "Oviraptor" = "Oviraptor",
    "Ovis" = "Ovis",
    "Pachy" = "Pachy",
    "Pachycephalosaurus" = "Pachycephalosaurus",
    "Pachyrhinosaurus" = "Pachyrhinosaurus",
    "Paraceratherium" = "Paraceratherium",
    "Parasaur" = "Parasaur",
    "Pegomastax" = "Pegomastax",
    "Pelagornis" = "Pelagornis",
    "Phiomia" = "Phiomia",
    "Phoenix" = "Phoenix",
    "Piranha" = "Piranha",
    "Plesiosaur" = "Plesiosaur",
    "Polar Bear" = "Polar Bear",
    "Procoptodon" = "Procoptodon",
    "Pteranodon" = "Pteranodon",
    "Pulmonoscorpius" = "Pulmonoscorpius",
    "Purlovia" = "Purlovia",
    "Quetzal" = "Quetzal",
    "Raptor" = "Raptor",
    "Ravager" = "Ravager",
    "Reaper" = "Reaper",
    "Rex" = "Rex",
    "Rock Drake" = "Rock Drake",
    "Rockelemental" = "Rockelemental",
    "Rollrat" = "Rollrat",
    "Sabertooth" = "Sabertooth",
    "Sabertooth Salmon" = "Sabertooth Salmon",
    "Sarco" = "Sarco",
    "Sarcosuchus" = "Sarcosuchus",
    "Scout" = "Scout",
    "Seeker" = "Seeker",
    "Shadowmane" = "Shadowmane",
    "Shinehorn" = "Shinehorn",
    "Sinomacrops" = "Sinomacrops",
    "Snow Owl" = "Snow Owl",
    "Spino" = "Spino",
    "Spinosaur" = "Spinosaur",
    "Stegosaurus" = "Stegosaurus",
    "Tapejara" = "Tapejara",
    "Terrorbird" = "Terrorbird",
    "Therezinosaurus" = "Therezinosaurus",
    "Therizinosaurus" = "Therizinosaurus",
    "Thorny Dragon" = "Thorny Dragon",
    "Thylacoleo" = "Thylacoleo",
    "Titanoboa" = "Titanoboa",
    "Titanomyrma" = "Titanomyrma",
    "Titanosaur" = "Titanosaur",
    "Triceratops" = "Triceratops",
    "Trilobite" = "Trilobite",
    "Troodon" = "Troodon",
    "Tusoteuthis" = "Tusoteuthis",
    "Tyrannosaurus" = "Tyrannosaurus",
    "Unicorn" = "Unicorn",
    "Velonasaur" = "Velonasaur",
    "Voidwyrm" = "Voidwyrm",
    "Vulture" = "Vulture",
    "Woolly Rhino" = "Woolly Rhino",
    "Wyvern" = "Wyvern",
    "Yeti" = "Yeti",
    "Yutyrannus" = "Yutyrannus"
} 
