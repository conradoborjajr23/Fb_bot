const axios = require("axios");

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    credits: "conrado borja",
    description: "continues ai command",
    hasPrefix: false,
    cooldown: 3,
    aliases: ["ai,bot,chatbot,con"]
};

module.exports.run = async function ({ api, event, args }) {
    try {
        let q = args.join(" ");
        if (!q) {
            return api.sendMessage("Please provide a question. For example: ai what is your name?", event.threadID, event.messageID);
        }

        api.sendMessage("𝗖𝗢𝗡 𝗕𝗢𝗧✔, 𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁... \n\n if the loading or error occurred try using ai4 or gpt3", event.threadID, async (err, info) => {
            if (err) {
                console.error("Error sending initial message:", err);
                return api.sendMessage("An error occurred while processing your request.", event.threadID);
            }

            try {
                
                const userInfo = await api.getUserInfo(event.senderID);
                const senderName = userInfo[event.senderID].name;

        
                const response = await axios.get(`https://hercai.onrender.com/v3/hercai`);
                const answer = response.data.result;

                
                const finalMessage = `${answer}\n\n𝗔𝘀𝗸𝗲𝗱 𝗕𝗬: ${senderName}`;
                api.sendMessage(finalMessage, event.threadID);
            } catch (error) {
                console.error("Error fetching AI response or user info:", error);
                api.sendMessage("An error occurred while processing your request try using ai2 or gpt3 for temporary", event.threadID);
            }
        });
    } catch (error) {
        console.error("Error in ai command:", error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};
