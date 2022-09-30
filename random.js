/* const axios = require('axios');
require('dotenv').config();
const express = require('express');

const getToken = async (url, callback) => {
  axios.post(url, {
    client_id: process.env.TWITCH_CLIENT_ID2,
    client_secret: process.env.TWITCH_CLIENT_SECRET2,
    grant_type: 'client_credentials'
  }).then(async (res) => {
    callback(res);
  });
}
let userId = ''
let token = '';

const validateToken = (token) => {
  axios({
    method: 'get',
    url: 'https://id.twitch.tv/oauth2/validate',
    headers: {
      Authorization: `OAuth ${token}`
    }
  }).then(async (res) => {
    console.log("VALIDATE: ", res.data);
    userId = res.data.user_id;
    return res.data.user_id
  }
  ).catch(async (err) => {
    console.log(err);
  });
}
getToken(`https://id.twitch.tv/oauth2/token`, async (res) => {
  // console.log(res);
  // validateToken(res.data.access_token);
  let { data: userdata } = await axios.get(`https://api.twitch.tv/helix/users?login=drunkgerman03`, {
    headers: {
      'Authorization': `Bearer ${res.data.access_token}`,
      'Client-Id': process.env.TWITCH_CLIENT_ID2 || '',
    }
  });
  console.log("BRAWLHALLAUSERDATA: ", userdata)
  userId = userdata.data[0].id
  token = res.data.access_token

  // let { data: codestatus } = await axios.get(`https://api.twitch.tv/helix/channel_points/custom_rewards?broadcaster_id=75346877`, {
  //   headers: {
  //     'Authorization': `Bearer ${token}`,
  //     'Client-Id': process.env.TWITCH_CLIENT_ID2 || '',
  //   }
  // })
  // console.log("CODESTATUS: ", codestatus)
});

const getBrawlhallaCodes = (broadcaster_id, code) => {
  axios({
    method: 'get',
    url: `https://api.twitch.tv/helix/channel_points/custom_rewards`,
    params: {
      broadcaster_id: '75346877',
      //id
      // only_manageable_rewards: true
    },
    headers: {
      'Authorization': `Bearer ${code}`,
      'Client-Id': process.env.TWITCH_CLIENT_ID2 || '',
    }
  }).then(async (result) => {
    console.log(result.data)
  }).catch(async (err) => {
    console.log(err.response.data);
  });
}

let url = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${process.env.TWITCH_CLIENT_ID2}&redirect_uri=http://localhost:3000&scope=channel%3Aread%3Aredemptions+user%3Aread%3Abroadcast`
console.log(url)

const app = express();
app.get('/', async (req, res) => { 
  console.log(req.query);

  res.send("Test");
  axios.post(`https://id.twitch.tv/oauth2/token`, {
    client_id: process.env.TWITCH_CLIENT_ID2,
    client_secret: process.env.TWITCH_CLIENT_SECRET2,
    grant_type: 'authorization_code',
    code: req.query.code,
    redirect_uri: 'http://localhost:3000'
  }).then(async (res2) => {
    console.log("TOKEN: ",res2.data);
    validateToken(res2.data.access_token);
    await getBrawlhallaCodes(userId, res2.data.access_token);
    // res.send('success');
  }).catch(async (err) => {
    console.log(err.response.data);
  });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
}); */

const formatter = Intl.NumberFormat('en', { notation: 'compact' })


console.log(formatter.format(110343))