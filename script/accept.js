module.exports.config = {
  name: "accept",
  version: "1.0.2",
  role: 0,
  credits: "cliff",
  description: "Rules of the group",
  hasPrefix: false,
  cooldowns: 5,
  aliases: ["up"]
};

const rules = `
your request has been accepted wait for the acceptance like 1-2hours to review.
`;

module.exports.run = async function ({ api, event }) {
  api.sendMessage(rules, event.threadID, event.messageID);
};
