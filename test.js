const axios = require('axios')
let staticdata = [
    {
        legend_id: 3,
        legend_name_key: "bödvar",
        bio_name: "B\u00f6dvar",
        bio_aka: "The Unconquered Viking, The Great Bear",
        weapon_one: "Hammer",
        weapon_two: "Sword",
        strength: "6",
        dexterity: "6",
        defense: "5",
        speed: "5"
    },
    {
        legend_id: 4,
        legend_name_key: "cassidy",
        bio_name: "Cassidy",
        bio_aka: "The Marshal of the Old West",
        weapon_one: "Pistol",
        weapon_two: "Hammer",
        strength: "6",
        dexterity: "8",
        defense: "4",
        speed: "4"
    },
    {
        legend_id: 5,
        legend_name_key: "orion",
        bio_name: "Orion",
        bio_aka: "The Mysterious Stranger",
        weapon_one: "RocketLance",
        weapon_two: "Spear",
        strength: "4",
        dexterity: "6",
        defense: "6",
        speed: "6"
    },
    {
        legend_id: 6,
        legend_name_key: "lord vraxx",
        bio_name: "Lord Vraxx",
        bio_aka: "The Despotic",
        weapon_one: "RocketLance",
        weapon_two: "Pistol",
        strength: "4",
        dexterity: "8",
        defense: "4",
        speed: "6"
    },
    {
        legend_id: 7,
        legend_name_key: "gnash",
        bio_name: "Gnash",
        bio_aka: "The First Real Man",
        weapon_one: "Hammer",
        weapon_two: "Spear",
        strength: "7",
        dexterity: "3",
        defense: "5",
        speed: "7"
    },
    {
        legend_id: 8,
        legend_name_key: "queen nai",
        bio_name: "Queen Nai",
        bio_aka: "The Jaguar Queen",
        weapon_one: "Spear",
        weapon_two: "Katar",
        strength: "7",
        dexterity: "4",
        defense: "8",
        speed: "3"
    },
    {
        legend_id: 10,
        legend_name_key: "hattori",
        bio_name: "Hattori",
        bio_aka: "Demon Bride",
        weapon_one: "Sword",
        weapon_two: "Spear",
        strength: "4",
        dexterity: "6",
        defense: "4",
        speed: "8"
    },
    {
        legend_id: 11,
        legend_name_key: "sir roland",
        bio_name: "Sir Roland",
        bio_aka: "The Scarlet Lion",
        weapon_one: "RocketLance",
        weapon_two: "Sword",
        strength: "5",
        dexterity: "5",
        defense: "8",
        speed: "4"
    },
    {
        legend_id: 12,
        legend_name_key: "scarlet",
        bio_name: "Scarlet",
        bio_aka: "Lady Necessity, The daVinci of Steam",
        weapon_one: "Hammer",
        weapon_two: "RocketLance",
        strength: "8",
        dexterity: "5",
        defense: "5",
        speed: "4"
    },
    {
        legend_id: 13,
        legend_name_key: "thatch",
        bio_name: "Thatch",
        bio_aka: "The Madman of Barbados",
        weapon_one: "Sword",
        weapon_two: "Pistol",
        strength: "7",
        dexterity: "5",
        defense: "3",
        speed: "7"
    },
    {
        legend_id: 14,
        legend_name_key: "ada",
        bio_name: "Ada",
        bio_aka: "The Ghost in the Machine",
        weapon_one: "Pistol",
        weapon_two: "Spear",
        strength: "6",
        dexterity: "7",
        defense: "3",
        speed: "6"
    },
    {
        legend_id: 15,
        legend_name_key: "sentinel",
        bio_name: "Sentinel",
        bio_aka: "The Hammer of Justice",
        weapon_one: "Hammer",
        weapon_two: "Katar",
        strength: "5",
        dexterity: "4",
        defense: "7",
        speed: "6"
    },
    {
        legend_id: 9,
        legend_name_key: "lucien",
        bio_name: "Lucien",
        bio_aka: "The Highwayman",
        weapon_one: "Katar",
        weapon_two: "Pistol",
        strength: "3",
        dexterity: "5",
        defense: "6",
        speed: "8"
    },
    {
        legend_id: 16,
        legend_name_key: "teros",
        bio_name: "Teros",
        bio_aka: "The Minotaur",
        weapon_one: "Axe",
        weapon_two: "Hammer",
        strength: "8",
        dexterity: "3",
        defense: "6",
        speed: "5"
    },
    {
        legend_id: 19,
        legend_name_key: "brynn",
        bio_name: "Brynn",
        bio_aka: "Chooser of the Slain, Slayer of the Chosen",
        weapon_one: "Axe",
        weapon_two: "Spear",
        strength: "5",
        dexterity: "5",
        defense: "5",
        speed: "7"
    },
    {
        legend_id: 20,
        legend_name_key: "asuri",
        bio_name: "Asuri",
        bio_aka: "The Night Stalker",
        weapon_one: "Katar",
        weapon_two: "Sword",
        strength: "4",
        dexterity: "7",
        defense: "5",
        speed: "6"
    },
    {
        legend_id: 21,
        legend_name_key: "barraza",
        bio_name: "Barraza",
        bio_aka: "Diesel Heart, The Lord of the Waste",
        weapon_one: "Axe",
        weapon_two: "Pistol",
        strength: "6",
        dexterity: "4",
        defense: "8",
        speed: "4"
    },
    {
        legend_id: 18,
        legend_name_key: "ember",
        bio_name: "Ember",
        bio_aka: "The Fangwild's Daughter",
        weapon_one: "Bow",
        weapon_two: "Katar",
        strength: "6",
        dexterity: "6",
        defense: "3",
        speed: "7"
    },
    {
        legend_id: 23,
        legend_name_key: "azoth",
        bio_name: "Azoth",
        bio_aka: "The One-Man Dynasty",
        weapon_one: "Bow",
        weapon_two: "Axe",
        strength: "7",
        dexterity: "5",
        defense: "6",
        speed: "4"
    },
    {
        legend_id: 24,
        legend_name_key: "koji",
        bio_name: "Koji",
        bio_aka: "The Wanderer, Honor's Blade",
        weapon_one: "Bow",
        weapon_two: "Sword",
        strength: "5",
        dexterity: "8",
        defense: "4",
        speed: "5"
    },
    {
        legend_id: 22,
        legend_name_key: "ulgrim",
        bio_name: "Ulgrim",
        bio_aka: "The Unyielding Anvil, Son of Ivaldi",
        weapon_one: "Axe",
        weapon_two: "RocketLance",
        strength: "6",
        dexterity: "3",
        defense: "7",
        speed: "6"
    },
    {
        legend_id: 25,
        legend_name_key: "diana",
        bio_name: "Diana",
        bio_aka: "The Monster Hunter",
        weapon_one: "Bow",
        weapon_two: "Pistol",
        strength: "5",
        dexterity: "6",
        defense: "5",
        speed: "6"
    },
    {
        legend_id: 26,
        legend_name_key: "jhala",
        bio_name: "Jhala",
        bio_aka: "The Unbroken",
        weapon_one: "Axe",
        weapon_two: "Sword",
        strength: "7",
        dexterity: "7",
        defense: "3",
        speed: "5"
    },
    {
        legend_id: 28,
        legend_name_key: "kor",
        bio_name: "Kor",
        bio_aka: "The Boulder",
        weapon_one: "Fists",
        weapon_two: "Hammer",
        strength: "6",
        dexterity: "5",
        defense: "7",
        speed: "4"
    },
    {
        legend_id: 29,
        legend_name_key: "wu shang",
        bio_name: "Wu Shang",
        bio_aka: "The Traveler",
        weapon_one: "Fists",
        weapon_two: "Spear",
        strength: "5",
        dexterity: "7",
        defense: "5",
        speed: "5"
    },
    {
        legend_id: 30,
        legend_name_key: "val",
        bio_name: "Val",
        bio_aka: "The Weapon",
        weapon_one: "Fists",
        weapon_two: "Sword",
        strength: "4",
        dexterity: "5",
        defense: "6",
        speed: "7"
    },
    {
        legend_id: 31,
        legend_name_key: "ragnir",
        bio_name: "Ragnir",
        bio_aka: "The Dragon",
        weapon_one: "Katar",
        weapon_two: "Axe",
        strength: "5",
        dexterity: "6",
        defense: "6",
        speed: "5"
    },
    {
        legend_id: 32,
        legend_name_key: "cross",
        bio_name: "Cross",
        bio_aka: "The Dealmaker",
        weapon_one: "Pistol",
        weapon_two: "Fists",
        strength: "7",
        dexterity: "4",
        defense: "6",
        speed: "5"
    },
    {
        legend_id: 33,
        legend_name_key: "mirage",
        bio_name: "Mirage",
        bio_aka: "The Dune Weaver",
        weapon_one: "Scythe",
        weapon_two: "Spear",
        strength: "7",
        dexterity: "6",
        defense: "4",
        speed: "5"
    },
    {
        legend_id: 34,
        legend_name_key: "nix",
        bio_name: "Nix",
        bio_aka: "Freelance Reaper",
        weapon_one: "Scythe",
        weapon_two: "Pistol",
        strength: "4",
        dexterity: "5",
        defense: "7",
        speed: "6"
    },
    {
        legend_id: 35,
        legend_name_key: "mordex",
        bio_name: "Mordex",
        bio_aka: "The Ravenous",
        weapon_one: "Scythe",
        weapon_two: "Fists",
        strength: "6",
        dexterity: "4",
        defense: "5",
        speed: "7"
    },
    {
        legend_id: 36,
        legend_name_key: "yumiko",
        bio_name: "Yumiko",
        bio_aka: "The Kitsune",
        weapon_one: "Bow",
        weapon_two: "Hammer",
        strength: "4",
        dexterity: "7",
        defense: "4",
        speed: "7"
    },
    {
        legend_id: 37,
        legend_name_key: "artemis",
        bio_name: "Artemis",
        bio_aka: "The Answer",
        weapon_one: "RocketLance",
        weapon_two: "Scythe",
        strength: "5",
        dexterity: "5",
        defense: "4",
        speed: "8"
    },
    {
        legend_id: 38,
        legend_name_key: "caspian",
        bio_name: "Caspian",
        bio_aka: "The Master Thief",
        weapon_one: "Fists",
        weapon_two: "Katar",
        strength: "7",
        dexterity: "5",
        defense: "4",
        speed: "6"
    },
    {
        legend_id: 39,
        legend_name_key: "sidra",
        bio_name: "Sidra",
        bio_aka: "The Corsair Queen",
        weapon_one: "Cannon",
        weapon_two: "Sword",
        strength: "6",
        dexterity: "4",
        defense: "6",
        speed: "6"
    },
    {
        legend_id: 40,
        legend_name_key: "xull",
        bio_name: "Xull",
        bio_aka: "The Iron Commander",
        weapon_one: "Cannon",
        weapon_two: "Axe",
        strength: "9",
        dexterity: "4",
        defense: "5",
        speed: "4"
    },
    {
        legend_id: 42,
        legend_name_key: "kaya",
        bio_name: "Kaya",
        bio_aka: "The Natural",
        weapon_one: "Spear",
        weapon_two: "Bow",
        strength: "4",
        dexterity: "4",
        defense: "7",
        speed: "7"
    },
    {
        legend_id: 41,
        legend_name_key: "isaiah",
        bio_name: "Isaiah",
        bio_aka: "The Specialist",
        weapon_one: "Cannon",
        weapon_two: "Pistol",
        strength: "5",
        dexterity: "6",
        defense: "7",
        speed: "4"
    },
    {
        legend_id: 43,
        legend_name_key: "jiro",
        bio_name: "Jiro",
        bio_aka: "The Shogun's Shadow",
        weapon_one: "Sword",
        weapon_two: "Scythe",
        strength: "5",
        dexterity: "7",
        defense: "3",
        speed: "7"
    },
    {
        legend_id: 44,
        legend_name_key: "lin fei",
        bio_name: "Lin Fei",
        bio_aka: "The Teacher",
        weapon_one: "Katar",
        weapon_two: "Cannon",
        strength: "3",
        dexterity: "8",
        defense: "4",
        speed: "7"
    },
    {
        legend_id: 45,
        legend_name_key: "zariel",
        bio_name: "Zariel",
        bio_aka: "The Celestial",
        weapon_one: "Fists",
        weapon_two: "Bow",
        strength: "7",
        dexterity: "4",
        defense: "7",
        speed: "4"
    },
    {
        legend_id: 46,
        legend_name_key: "rayman",
        bio_name: "Rayman",
        bio_aka: "Champion of the Glade of Dreams",
        weapon_one: "Fists",
        weapon_two: "Axe",
        strength: "5",
        dexterity: "5",
        defense: "6",
        speed: "6"
    },
    {
        legend_id: 47,
        legend_name_key: "dusk",
        bio_name: "Dusk",
        bio_aka: "The Renegade Sorcerer",
        weapon_one: "Spear",
        weapon_two: "Orb",
        strength: "6",
        dexterity: "7",
        defense: "4",
        speed: "5"
    },
    {
        legend_id: 48,
        legend_name_key: "fait",
        bio_name: "Fait",
        bio_aka: "The Star Speaker",
        weapon_one: "Scythe",
        weapon_two: "Orb",
        strength: "7",
        dexterity: "4",
        defense: "4",
        speed: "7"
    },
    {
        legend_id: 49,
        legend_name_key: "thor",
        bio_name: "Thor",
        bio_aka: "The God of Thunder",
        weapon_one: "Hammer",
        weapon_two: "Orb",
        strength: "6",
        dexterity: "4",
        defense: "7",
        speed: "5"
    },
    {
        legend_id: 50,
        legend_name_key: "petra",
        bio_name: "Petra",
        bio_aka: "The Darkheart",
        weapon_one: "Fists",
        weapon_two: "Orb",
        strength: "8",
        dexterity: "4",
        defense: "4",
        speed: "6"
    },
    {
        legend_id: 51,
        legend_name_key: "vector",
        bio_name: "Vector",
        bio_aka: "The Superbot",
        weapon_one: "RocketLance",
        weapon_two: "Bow",
        strength: "5",
        dexterity: "4",
        defense: "6",
        speed: "7"
    },
    {
        legend_id: 52,
        legend_name_key: "volkov",
        bio_name: "Volkov",
        bio_aka: "The Vampire King",
        weapon_one: "Axe",
        weapon_two: "Scythe",
        strength: "4",
        dexterity: "8",
        defense: "6",
        speed: "4"
    },
    {
        legend_id: 53,
        legend_name_key: "onyx",
        bio_name: "Onyx",
        bio_aka: "The Gargoyle",
        weapon_one: "Fists",
        weapon_two: "Cannon",
        strength: "5",
        dexterity: "4",
        defense: "8",
        speed: "5"
    },
    {
        legend_id: 54,
        legend_name_key: "jaeyun",
        bio_name: "Jaeyun",
        bio_aka: "The Sellsword",
        weapon_one: "Sword",
        weapon_two: "Greatsword",
        strength: "6",
        dexterity: "5",
        defense: "5",
        speed: "6"
    },
    {
        legend_id: 55,
        legend_name_key: "mako",
        bio_name: "Mako",
        bio_aka: "The Shark",
        weapon_one: "Katar",
        weapon_two: "Greatsword",
        strength: "6",
        dexterity: "4",
        defense: "4",
        speed: "8"
    },
    {
        legend_id: 56,
        legend_name_key: "magyar",
        bio_name: "Magyar",
        bio_aka: "The Spectral Guardian",
        weapon_one: "Hammer",
        weapon_two: "Greatsword",
        strength: "5",
        dexterity: "4",
        defense: "9",
        speed: "4"
    },
    {
        legend_id: 57,
        legend_name_key: "reno",
        bio_name: "Reno",
        bio_aka: "The Bounty Hunter",
        weapon_one: "Pistol",
        weapon_two: "Orb",
        strength: "4",
        dexterity: "7",
        defense: "6",
        speed: "5"
    },
    {
        legend_id: 58,
        legend_name_key: "munin",
        bio_name: "Munin",
        bio_aka: "The Raven",
        weapon_one: "Bow",
        weapon_two: "Scythe",
        strength: "5",
        dexterity: "6",
        defense: "4",
        speed: "7"
    },
    {
        legend_id: 59,
        legend_name_key: "arcadia",
        bio_name: "Arcadia",
        bio_aka: "The Faerie Queen",
        weapon_one: "Spear",
        weapon_two: "Greatsword",
        strength: "7",
        dexterity: "7",
        defense: "4",
        speed: "4"
    }
]

let bwl = 
[
  {
    name: "bödvar",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/bodvar.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/02/BodvarSplash-1.png",
    gender: "male"
  },
  {
    name: "cassidy",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/cassidy.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/02/CassidySplash-1.png",
    gender: "female"
  },
  {
    name: "orion",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/orion.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/02/OrionSplash-1.png",
    gender: "male"
  },
  {
    name: "lord vraxx",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_VraxxM-1.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/02/VraxxSplash.png",
    gender: "male"
  },
  {
    name: "gnash",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/gnash.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/02/GnashSplash.png",
    gender: "male"
  },
  {
    name: "queen nai",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/nai.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/02/NaiSplash.png",
    gender: "female"
  },
  {
    name: "hattori",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/hattori.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/02/HattoriSplash.png",
    gender: "female"
  },
  {
    name: "sir roland",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/roland.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/02/RolandSplash.png",
    gender: "male"
  },
  {
    name: "scarlet",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/scarlet.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/02/ScarletSplash.png",
    gender: "female"
  },
  {
    name: "thatch",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/thatch.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/02/UpdatedThatch.png",
    gender: "male"
  },
  {
    name: "ada",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/ada.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/02/AdaSplash.png",
    gender: ""
  },
  {
    name: "sentinel",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/sentinel.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/02/SentinelSplash.png",
    gender: "female"
  },
  {
    name: "lucien",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/lucien.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/02/LucienSplash.png",
    gender: "male"
  },
  {
    name: "teros",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/teros.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/02/TerosSplash.png",
    gender: "male"
  },
  {
    name: "brynn",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_ValkyrieM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/02/BrynnSplash.png",
    gender: "female"
  },
  {
    name: "asuri",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_CatM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/02/AsuriSplash.png",
    gender: "female"
  },
  {
    name: "barraza",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_ApocM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/02/BarrazaSplash.png",
    gender: "male"
  },
  {
    name: "ember",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_ElfM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/02/EmberSplash.png",
    gender: "female"
  },
  {
    name: "azoth",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_AzothM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/03/AzothSplash.png",
    gender: "male"
  },
  {
    name: "koji",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_SamuraiM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/03/KojiSplash.png",
    gender: "male"
  },
  {
    name: "ulgrim",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_DwarfM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/03/UlgrimSplash.png",
    gender: ""
  },
  {
    name: "diana",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_MonsterHunterM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/03/DianaSplash.png",
    gender: "female"
  },
  {
    name: "jhala",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_BarbarianM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/03/JhalaSplash.png",
    gender: "female"
  },
  {
    name: "kor",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_GolemM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/03/KorSplash.png",
    gender: "male"
  },
  {
    name: "wu shang",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_MonkM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/03/WuShangSplash.png",
    gender: "male"
  },
  {
    name: "val",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_ValM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/05/ValSplash.png",
    gender: "female"
  },
  {
    name: "ragnir",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_DragonM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/05/RagnirSplash.png",
    gender: "male"
  },
  {
    name: "cross",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_CrossM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/05/CrossSplashNoShadow.png",
    gender: "male"
  },
  {
    name: "mirage",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_AssassinM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/05/MirageSplash.png",
    gender: "female"
  },
  {
    name: "nix",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_ReaperM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/05/NixSplash.png",
    gender: "female"
  },
  {
    name: "mordex",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_WerewolfM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/05/MordexSplash.png",
    gender: "male"
  },
  {
    name: "yumiko",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_KitsuneM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/05/Yumiko1.png",
    gender: "female"
  },
  {
    name: "artemis",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_SpaceHunterM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/05/ArtemisSplash.png",
    gender: "female"
  },
  {
    name: "caspian",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_ThiefM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/05/CaspianSplash.png",
    gender: "male"
  },
  {
    name: "sidra",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_CorsairM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/05/SidraSplash.png",
    gender: "female"
  },
  {
    name: "xull",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_BruteM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/05/XullSplash.png",
    gender: "male"
  },
  {
    name: "kaya",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_InuitM-1.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/05/KayaSplash.png",
    gender: "female"
  },
  {
    name: "isaiah",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_SoldierM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/05/IsaiahSplash.png",
    gender: "male"
  },
  {
    name: "jiro",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_ShinobiM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/05/JiroSplash.png",
    gender: "male"
  },
  {
    name: "lin fei",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_WuxiaM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/05/LinFeiSplash.png",
    gender: "female"
  },
  {
    name: "zariel",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_CelestialM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/05/ZarielSplash.png",
    gender: "none"
  },
  {
    name: "rayman",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_RaymanM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/05/RaymanSplash_Single.png",
    gender: "male"
  },
  {
    name: "dusk",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_ElfwarM.png",
    img: "https://www.brawlhalla.com/c/uploads/2018/12/duskcard.png",
    gender: "male"
  },
  {
    name: "fait",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_SpellwitchM.png",
    img: "https://www.brawlhalla.com/c/uploads/2019/02/faitcard.png",
    gender: "female"
  },
  {
    name: "thor",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_ThorM.png",
    img: "https://www.brawlhalla.com/c/uploads/2019/05/thorcard.jpg",
    gender: "male"
  },
  {
    name: "petra",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_RagefighterM.png",
    img: "https://www.brawlhalla.com/c/uploads/2019/07/petracard.png",
    gender: "female"
  },
  {
    name: "vector",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_ActualRobotM.png",
    img: "https://www.brawlhalla.com/c/uploads/2019/09/LegendCard_Vector.jpg",
    gender: "male"
  },
  {
    name: "volkov",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_VampLordM.png",
    img: "https://www.brawlhalla.com/c/uploads/2019/12/LegendSTATCard_Volkov-1.jpg",
    gender: "male"
  },
  {
    name: "onyx",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_GargoyleM.png",
    img: "https://www.brawlhalla.com/c/uploads/2020/03/LegendCard_Onyx.jpg",
    gender: "female"
  },
  {
    name: "jaeyun",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_SellswordM.png",
    img: "https://www.brawlhalla.com/c/uploads/2020/07/LegendCard_jaeyun-1.jpg",
    gender: "male"
  },
  {
    name: "mako",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_ActualSharkM.png",
    img: "https://www.brawlhalla.com/c/uploads/2020/10/MakoSTATS_650x1080.jpg",
    gender: "female"
  },
  {
    name: "magyar",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_GhostArmorM.png",
    img: "https://www.brawlhalla.com/c/uploads/2021/01/LegendStats_Magyare.jpg",
    gender: "none"
  },
  {
    name: "reno",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/07/a_Roster_Pose_BountyHunterM.png",
    img: "https://www.brawlhalla.com/c/uploads/2021/04/LegendCard_Reno.jpg",
    gender: "male"
  },
  {
    name: "munin",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2021/12/a_Roster_Pose_BirdBardM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/03/MuninSplash.png",
    gender: "female"
  },
  {
    name: "arcadia",
    thumbnail: "https://www.brawlhalla.com/c/uploads/2022/03/a_Roster_Pose_FairyQueenM.png",
    img: "https://www.brawlhalla.com/c/uploads/2022/03/Arcadia_FX.png",
    gender: "female"
  }
]
let legends = []
// bwl.forEach(async (legend) => {
//     let temp = legend
//     let legen = staticdata.find((leg) => leg.legend_name_key === legend.name)
//     delete temp.name
    
    
    
// })

let interval = 55
async function getLeg(id, leg) {
    delete leg.name
    try {
        await axios.get(`https://api.brawlhalla.com/legend/${id}?api_key=17O5Y4XD4PY5AFAJWWX9`).then(async(res) => {
            // if (!res.data.length || !res.data) return
            let s = bwl.find((l) => l.name === res.data.legend_name_key)
            delete s.name
            let newtemp = Object.assign(res.data, s)
            legends.push(newtemp)
        });
    } catch (e) {
        console.log(e);
    }
}
setInterval(async () => {
    if (interval < 60) {
        console.log(interval)
        getLeg(interval, bwl[0])
        interval++
        // console.log(legends)
    } else {
        console.log(legends)
    }
    
}, 5000)

