const chilli = require('axios');
const hot = require('fs');
const pogi = require('path');

module.exports.bingchilling = {
    name: 'ringtone',
    version: '1.0.0',
    role: 0,
    hasPrefix: false,
    aliases: ['ringtone'],
    description: "bang bang",
    usage: "ringtone [query]",
    credits: 'churchill',
    cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
    const query = args.join(" ");

    if (!query) {
        api.sendMessage('Usage: ringtone [query].', event.threadID, event.messageID);
        return;
    }

    api.sendMessage('Searching for your ringtone, please wait...', event.threadID, event.messageID);

    const url = `https://joshweb.click/api/ringtone?q=${encodeURIComponent(query)}`;

    try {
        const response = await chilli.get(url);
        const result = response.data;

        if (result.status !== 200) {
            api.sendMessage('Error fetching ringtones.', event.threadID, event.messageID);
            return;
        }

        const ringtones = result.result;

        if (ringtones.length === 0) {
            api.sendMessage('No ringtones found for the given query.', event.threadID, event.messageID);
            return;
        }

        const ringtone = ringtones[0];
        const audioUrl = ringtone.audio;
        const audioResponse = await chilli.get(audioUrl, { responseType: 'arraybuffer' });
        const audioBuffer = Buffer.from(audioResponse.data, 'binary');
        const audioPath = pogi.join(__dirname, `${ringtone.title}.mp3`);

        hot.writeFileSync(audioPath, audioBuffer);

        api.sendMessage({
            body: `Title: ${ringtone.title}\nSource: ${ringtone.source}`,
            attachment: hot.createReadStream(audioPath)
        }, event.threadID, (err) => {
            if (err) console.error('Error sending ringtone:', err);
            hot.unlinkSync(audioPath);
        });

    } catch (error) {
        console.error('Error:', error);
        api.sendMessage('Error: ' + error.message, event.threadID, event.messageID);
    }
};
