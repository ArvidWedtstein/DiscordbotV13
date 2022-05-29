import { ShardingManager } from 'discord.js'
import * as dotenv from 'dotenv';
dotenv.config();
const shardManager = new ShardingManager('./dist/index.js', {
    token: process.env.CLIENT_TOKEN,
    shardList: "auto",
    totalShards: "auto"
})

shardManager.on('shardCreate', shard => {
    console.log(`Launching shard ${shard.id}`)
})

shardManager.spawn()