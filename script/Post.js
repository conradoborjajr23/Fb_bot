const axios = require('axios');
const fs = require('fs');
const path = require('path');

const autopostWithMedia = async (mediaUrl, caption, isVideo) => {
  try {
    let mediaResponse;
    if (isVideo) {
      const videoData = {
        access_token: accessToken,
        file_url: mediaUrl,
        description: caption,
      };
      mediaResponse = await axios.post('https://graph-video.facebook.com/me/videos', videoData);
    } else {
      const photoData = {
        access_token: accessToken,
        url: mediaUrl,
        caption: caption,
      };
      mediaResponse = await axios.post('https://graph.facebook.com/me/photos', photoData);
    }

    if (mediaResponse.status === 200 && mediaResponse.data.id) {
      const mediaId = mediaResponse.data.id;
      const postData = {
        attached_media: [{ media_fbid: mediaId }],
        access_token: accessToken,
      };
      const response = await axios.post('https://graph.facebook.com/me/feed', postData);

      if (response.status === 200) {
        console.log(`Posted ${isVideo ? 'video' : 'photo'} to your timeline successfully.`);
      } else {
        console.error(`Failed to post ${isVideo ? 'video' : 'photo'} to your timeline.`);
      }
    } else {
      console.error(`Failed to upload the ${isVideo ? 'video' : 'photo'}.`);
    }
  } catch (error) {
    console.error(`Error posting ${isVideo ? 'video' : 'photo'} to timeline:`, error.response?.data || error.message);
  }
};

module.exports.config = {
  name: "post",
  version: "1.0.0",
  role: 2,
  credits: "Mirai Team",
  description: "Create a new post in acc bot.",
  cooldowns: 5,
  hasPrefix: false,
  usage: "{p}{n} choose 1/3 and posted description or {p}{n} reply image or video and description ∆ accessToken" // Fixed the missing quotation mark
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, senderID } = event;

  if (event.type === "message_reply") {
    const attachment = event.messageReply.attachments[0];
    if (attachment && (attachment.type === "photo" || attachment.type === "video")) {
      const mediaUrl = encodeURIComponent(attachment.url);
      const input = args.join(" ");
      const isVideo = attachment.type === "video";
      
      try {
        const [caption, accessToken] = input.split(" ∆ ");
        if (!caption || !accessToken) { // Fixed typo here: changed 'accesToken' to 'accessToken'
          return api.sendMessage(`Invalid Usage: Use ${module.exports.config.usage}`, event.threadID);
        }
        await autopostWithMedia(mediaUrl, caption, isVideo);
        api.sendMessage(`Posted ${isVideo ? 'video' : 'photo'} to your timeline successfully.`, threadID, messageID);
      } catch (error) {
        api.sendMessage(`Failed to post ${isVideo ? 'video' : 'photo'}.`, threadID, messageID);
      }
    } else {
      api.sendMessage("The reply does not contain a photo or video attachment.", threadID, messageID);
    }
  } else {
    const uuid = getGUID();
    const audienceOptions = {
      "1": "EVERYONE",
      "2": "FRIENDS",
      "3": "SELF"
    };

    const audienceChoice = args[0];
    const content = args.slice(1).join(" ");

    if (!audienceOptions[audienceChoice]) {
      return api.sendMessage("Invalid audience choice. Please choose 1, 2, or 3.", threadID, messageID);
    }

    const formData = {
      "input": {
        "composer_entry_point": "inline_composer",
        "composer_source_surface": "timeline",
        "idempotence_token": uuid + "_FEED",
        "source": "WWW",
        "attachments": [],
        "audience": {
          "privacy": {
            "allow": [],
            "base_state": audienceOptions[audienceChoice],
            "deny": [],
            "tag_expansion_state": "UNSPECIFIED"
          }
        },
        "message": {
          "ranges": [],
          "text": content
        },
        "with_tags_ids": [],
        "inline_activities": [],
        "explicit_place_id": "0",
        "text_format_preset_id": "0",
        "logging": {
          "composer_session_id": uuid
        },
        "tracking": [
          null
        ],
        "actor_id": api.getCurrentUserID(),
        "client_mutation_id": Math.floor(Math.random() * 17)
      },
      "displayCommentsFeedbackContext": null,
      "displayCommentsContextEnableComment": null,
      "displayCommentsContextIsAdPreview": null,
      "displayCommentsContextIsAggregatedShare": null,
      "feedLocation": "TIMELINE",
      "feedbackSource": 0,
      "focusCommentID": null,
      "gridMediaWidth": 230,
      "groupID": null,
      "scale": 3,
      "privacySelectorRenderLocation": "COMET_STREAM",
      "renderLocation": "timeline",
      "useDefaultActor": false,
      "inviteShortLinkKey": null,
      "isFeed": false,
      "isFundraiser": false,
      "isFunFactPost": false,
      "isGroup": false,
      "isTimeline": true,
      "isSocialLearning": false,
      "isPageNewsFeed": false,
      "isProfileReviews": false,
      "isWorkSharedDraft": false,
      "UFI2CommentsProvider_commentsKey": "ProfileCometTimelineRoute",
      "hashtag": null,
      "canUserManageOffers": false
    };

    try {
      const postResult = await createPost(api, formData);
      return api.sendMessage(`Post created successfully:\nPost ID: ${postResult.postID}\nPost URL: ${postResult.postURL}`, threadID, messageID);
    } catch (error) {
      console.error("Error creating post:", error);
      return api.sendMessage("Failed to create post. Please try again later.", threadID, messageID);
    }
  }
};

async function createPost(api, formData) {
  return new Promise((resolve, reject) => {
    const form = {
      av: api.getCurrentUserID(),
      fb_api_req_friendly_name: "ComposerStoryCreateMutation",
      fb_api_caller_class: "RelayModern",
      doc_id: "7711610262190099",
      variables: JSON.stringify(formData)
    };

    api.httpPost('https://www.facebook.com/api/graphql/', form, (error, result) => {
      if (error) {
        reject(error);
      } else {
        try {
          const responseData = JSON.parse(result.replace("for (;;);", ""));
          const postID = responseData.data.story_create.story.legacy_story_hideable_id;
          const postURL = responseData.data.story_create.story.url;
          resolve({ postID, postURL });
        } catch (parseError) {
          reject(parseError);
        }
      }
    });
  });
}

function getGUID() {
  var sectionLength = Date.now();
  var id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.floor((sectionLength + Math.random() * 16) % 16);
    sectionLength = Math.floor(sectionLength / 16);
    var _guid = (c == "x" ? r : (r & 7) | 8).toString(16);
    return _guid;
  });
  return id;
}
