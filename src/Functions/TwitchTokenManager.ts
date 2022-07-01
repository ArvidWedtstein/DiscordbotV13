import axios from 'axios';
import Client from '../Client';

export const GetToken = (client: Client, callback: (result: any) => void) => {
  if (ValidateToken(client.config.BrawlhallaToken || "")) {
    return callback({ data: { access_token: client.config.BrawlhallaToken } });
  }

  axios({
    method: 'post',
    url: `https://id.twitch.tv/oauth2/token`,
    data: {
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials'
    }
  }).then(async (res) => {
    if (ValidateToken(res.data.access_token)) return callback(res);
    else return callback({ data: { access_token: client.config.BrawlhallaToken } });
  });
}


export const ValidateToken = (token: string): boolean => {
  if (token === '') return false;

  axios({
    method: 'get',
    url: 'https://id.twitch.tv/oauth2/validate',
    headers: {
      Authorization: `OAuth ${token}`
    }
  }).then(async (res) => {
    if (res.status != 200) return false;
  }).catch(async (err) => {
    throw new Error(err);
    return false;
  });
  return true;
}