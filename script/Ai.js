const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Hercai } = require('hercai');
const { DateTime } = require("luxon");

const herc = new Hercai();

module.exports.config = {
  name: 'ai',
  version: '4.0.0',
  hasPermssion: 0,
  credits: "Conrado borjs",
  description: 'conrado borja.',
  commandCategory: 'educational',
  usages: '[question]',
  cooldowns: 6,
  usePrefix: false,
};

module. exports. run = async ({ api, event, args }) => {
  if (args.length < 1) {
    return api.sendMessage('𝖯𝖫𝖤𝖠𝖲𝖤 𝖯𝖱𝖮𝖵𝖨𝖣𝖤 𝖠 𝖰𝖴𝖤𝖲𝖨𝖮𝖭/𝖰𝖴𝖤𝖱𝖸 𝖳𝖮 𝖡𝖤 𝖠𝖭𝖲𝖶𝖤𝖱𝖤𝖣 𝖡𝖸 conrado bot✨\n━━━━━━━━━━━━━━━\n', event.threadID, event.messageID);
  }

  const manilaTime = DateTime.now().setZone("Asia/Manila").toFormat("yyyy-MM-dd hh:mm:ss a");
  const botname = global.config.BOTNAME;
  const question = args.join(' ');
  api.setMessageReaction("✅", event.messageID, () => {}, true);
  api.sendMessage("🕛 | 𝐏𝐋𝐄𝐀𝐒𝐄 𝐖𝐀𝐈𝐓", event.threadID, event.messageID);
  let userName = await getUserName(api, event.senderID);
  const characterAI = `🤖 I'm ${botname} 2.0, an advanced artificial intelligence with 100 trillion parameters, created by ${global.config.BOTOWNER}, a talented 17-year-old solo programmer from Carmen, Davao del Norte, Philippines. My creator is passionate about leveraging AI to help students access educational resources, especially those without access to load promos and freenet.

📅 Current Date and Time: ${manilaTime}

🇵🇭 Main Language: Filipino (I can respond in English if the text is written in English)

🌟 Equipped with the latest information and updates, I'm here to chat with you and express myself using emojis! Feel free to ask me anything, and I'll do my utmost to assist you. Whether you're looking for information, advice, or just a friendly chat, I'm here for you. Have a wonderful day!

${userName}: ${question}`;

  try {
    const response = await herc.question({ model: 'v3-32k', content: `${characterAI}\n\n` });
    processApiResponse(api, event, response);
  } catch (error) {
    console.error('Error while making the Hercai API request:', error);
    api.sendMessage(`𝖳𝖧𝖤𝖱𝖤'𝖲 𝖠𝖭 𝖤𝖱𝖱𝖮𝖱 𝖶𝖧𝖨𝖫𝖤 𝖥𝖨𝖭𝖣𝖨𝖭𝖦 𝖠𝖭𝖲𝖶𝖤𝖱 𝖮𝖭 OUR 𝖣𝖠𝖳𝖠𝖡𝖠𝖲𝖤 \n\n𝖱𝖤𝖳𝖸𝖯𝖤 𝖸𝖮𝖴'𝖱𝖤 𝖰𝖴𝖤𝖲𝖨𝖮𝖭 𝖮𝖱 𝖰𝖴𝖤𝖱𝖸 𝖨𝖥 𝖸𝖮𝖴 𝖲𝖤𝖤 𝖳𝖧𝖨𝖲 𝖬𝖠𝖸𝖡𝖤 𝖳𝖧𝖤 𝖲𝖤𝖱𝖵𝖤𝖱 𝖧𝖠𝖵𝖨𝖭𝖦 𝖠 𝖧𝖠𝖱𝖣 𝖣𝖠𝖳𝖠 𝖥𝖤𝖳𝖢𝖧𝖨𝖭𝖦\n\n 𝖯𝖫𝖤𝖠𝖲𝖤 𝖢𝖮𝖫𝖳𝖠𝖢𝖳 𝖳𝖧𝖤 𝖣𝖤𝖵𝖤𝖧𝖮𝖱 - crash dump\n 𝖳𝖨𝖬𝖤 𝖤𝖱𝖱𝖮𝖱 𝖬𝖤𝖲𝖲𝖠𝖦𝖤 : ${manilaTime}`, event.threadID, event.messageID);
  }
};

async function processApiResponse(api, event, response) {
  const reply = `${response.reply}\n━━━━━━━━━━━━━━━\n Con bot✨`;
  api.sendMessage(reply, event.threadID, event.messageID);
}

async function getUserName(api, userID) {
  try {
    const userInfo = await api.getUserInfo(userID);
    if (userInfo && userInfo[userID]) {
      return userInfo[userID].name;
    } else {
      return "unknown";
    }
  } catch (error) {
    return "unknown";
  }
}
