import { Event } from '../Interfaces';
import * as gradient from 'gradient-string';
import { loadLanguages } from '../Functions/language';
import { brawlhalla } from '../Functions/brawlhalla';
import { loadColors } from '../Functions/icon';
import birthday from '../Functions/birthday';
import path from 'path';
import moment from 'moment'
import profileSchema from 'schemas/profileSchema';
import APIcacheSchema from 'schemas/APIcacheSchema';
import axios from 'axios';
export const event: Event = {
    name: "ready",
    run: async (client) => {
        function resetAtMidnight() {
            var now = new Date();
            var night = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1,
                0, 0, 0
            );
            var msToMidnight = night.getTime() - now.getTime();
        
            setTimeout(function() {
                getStats();         
                resetAtMidnight();    //      Then, reset again next midnight.
            }, msToMidnight);
        }


        function getStats() {
            profileSchema.find({
                brawlhallaStats: { $exists: true, $ne: null }
            }, (err: any, profiles: any) => {
                if (err) console.log(err);
                profiles.forEach(async (profile: any) => {
                    let { data } = await axios.get(`https://api.brawlhalla.com/player/${profile.brawlhallaId}/ranked?api_key=${process.env.BRAWLHALLA_API_KEY}`)
                    new APIcacheSchema({
                        userId: profile.userId,
                        data: {
                            rating: data.rating
                        }
                    })
                })
            })
        }
    }
}