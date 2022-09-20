import Client from '../Client';
import axios from 'axios';
import { AttachmentBuilder, MessageButton, EmbedBuilder } from 'discord.js';
import profileSchema from '../schemas/profileSchema';
import moment from 'moment';
import gradient from 'gradient-string';
import { promisify } from 'util'
import { createClient } from 'redis'

const client = createClient({})


const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const setexAsync = promisify(client.setEx).bind(client);
const ttlAsync = promisify(client.ttl).bind(client);

client.on('error', function (error) {
  console.error(error);
});

/**
 * Writes strigify data to cache
 * @param {string} key key for the cache entry
 * @param {*} value any object/string/number */
export const cacheSet = async (key: string, value: any) => {
    console.log('⚡️  Setting cache entry:', key);
  return await setAsync(key, JSON.stringify(value));
};

/**
 * Writes strigify data to cache
 * @param {string} key key for the cache entry
 * @param {*} value any object/string/number
 * @param {number} ttl cache duration in seconds, default 3600 (1h) */
export const cacheSetTTL = async (key: string, value: any, ttl = 3600) => {
  console.log('⚡️  Setting cache TTL entry:', key);
  return await setexAsync(key, ttl, JSON.stringify(value));
};

/** Retrieves data for a given key
 * @param {string} key key of the cached entry */
const cacheGet = async (key: string) => {
  const data = await getAsync(key);

  return JSON.parse(data);
};

/**
 * Fetch for the Weather API endpoint
 * @param {string} city - City to be fetched
 */
export const fetchData = async (datakey: string) => {
  const isCached = await cacheGet(datakey);

  if (isCached) {
    console.log('⚡️  From cache');

    return isCached;
  } else {
    return false;
  }
};

