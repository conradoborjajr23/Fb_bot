module.exports.config = {
  name: 'userid',
  version: '1.1.1',
  hasPermssion: 0,
  role: 0,
  credits: "cliff",
  author: '',
  aliases: ["id"],
  description: 'finder uid',
  usePrefix: false,
  hasPrefix: false,
  commandCategory: 'AI',
  usage: '[prompt]',
  cooldown: 0,
};

module.exports["run"]= async function({ api, event, args }) {
  const axios = require('axios');
  let fblink = args.join(' ');
  try {
      if (!user) {
          return api.sendMessage('Provide fblink first!', event.threadID, event.messageID);
      }
      const cliff = await new Promise(resolve => { api.sendMessage('finding userId...', event.threadID, (err, info1) => {
      resolve(info1);
     }, event.messageID);
    });
      const response = await axios.get(`https://hastebinupload-ghost-2de6112e.vercel.app/uid?fblink=${encodeURIComponent(fblink)}`);
      const responseData = response.data.uid;  
      const baby = `${fblink} => ${responseData}`;
      api.editMessage(baby, cliff.messageID);
  } catch (err) {
      console.error(err);
      return api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};
