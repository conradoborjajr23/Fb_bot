const { get } = require('axios');

module.exports.config = {
  name: 'ai',
  credits: "con",
  version: '1.0.0',
  role: 0,
  aliases: ["Gpt"],
  cooldown: 1,
  hasPrefix: false,
  usage: "",
};

module.exports.run = async function ({ api, event, args }) {
  const question = args.join(' ');
  function sendMessage(msg) {
    api.sendMessage(msg, event.threadID, event.messageID);
  }

  const url = "https://joshweb.click/api/gpt-4o?q=hi&uid=";

  if (!question) return sendMessage("Please provide a question to begin ✨");

  try {
    const response = await get(`${url}?question=${encodeURIComponent(question)}`);
    sendMessage(response.data.reply);
  } catch (error) {
    sendMessage("An error occurred: " + error.message);
  }
};
