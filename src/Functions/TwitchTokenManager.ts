import axios from 'axios';
import { tokenToString } from 'typescript';

export const GetToken = (url: string, callback: (result: any) => void) => {
  axios({
    method: 'post',
    url: url,
    data: {
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials'
    }
  }).then(async (res) => {
    callback(res);
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