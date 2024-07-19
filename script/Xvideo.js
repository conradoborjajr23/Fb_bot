const axios = require("axios");
const fs = require("fs-extra");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

module.exports.config = {
    name: "xvideo",
    version: "1.0.0",
    credits: "chilli",
    description: "Fetch a random video",
    hasPrefix: true,
    cooldown: 5,
    usage: "xvideo",
    aliases: ["xvid"]
};

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID } = event;
    const videoDir = path.resolve(__dirname, "temp_videos");
    const videoPath = path.join(videoDir, "video.mp4");
    const compressedVideoPath = path.join(videoDir, "compressed_video.mp4");

    try {
        await fs.ensureDir(videoDir);

        const response = await axios.get("https://markdevs69-1efde24ed4ea.herokuapp.com/xvideos");
        if (response.status !== 200 || !response.data.link) {
            return api.sendMessage("No video found.", threadID, messageID);
        }
        const videoUrl = response.data.link;

        const videoResponse = await axios({
            url: videoUrl,
            method: 'GET',
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(videoPath);
        videoResponse.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        await new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .outputOptions('-preset', 'fast')
                .outputOptions('-crf', '28')
                .save(compressedVideoPath)
                .on('end', resolve)
                .on('error', reject);
        });

        const message = {
            body: "Here is your video!",
            attachment: fs.createReadStream(compressedVideoPath)
        };
        api.sendMessage(message, threadID, messageID);

    } catch (error) {
        console.error("Error fetching or sending video:", error);
        api.sendMessage("An error occurred while processing the video.", threadID, messageID);
    } finally {
        await fs.remove(videoDir);
    }
};
