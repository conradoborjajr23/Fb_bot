module.exports.config = {
	name: "count",
	version: "1.3",
	credits: "Ntkhang", //converted by cliff
	cooldown: 5,
	role: 0,
	hasPrefix: false,
	description: "count all members",
	hasPermission: 0,
	commandCategory: "threadinfo",
	usePrefix: false,
};

module.exports["run"] = async function ({ args, event, api }) {
	const { threadID, senderID } = event;
	const threadData = await api.getThreadInfo(threadID);
	const { members } = threadData;
	const usersInGroup = (await api.getThreadInfo(threadID)).participantIDs;
	let arraySort = [];
	for (const user of members) {
		if (!usersInGroup.includes(user.userID)) continue;
		const charac = "️️️️️️️️️️️️️️️️️"; // This character is banned from facebook chat (it is not an empty string)
		arraySort.push({
			name: user.name.includes(charac) ? `Uid: ${user.userID}` : user.name,
			count: user.count,
			uid: user.userID
		});
	}
	let stt = 1;
	arraySort.sort((a, b) => b.count - a.count);
	arraySort.map(item => item.stt = stt++);

	if (args[0]) {
		if (args[0].toLowerCase() == "all") {
			let msg = "Number of messages of members:";
			const endMessage = "Those who do not have a name in the list have not sent any messages";
			for (const item of arraySort) {
				if (item.count > 0)
					msg += `\n${item.stt}/ ${item.name}: ${item.count}`;
			}
			api.sendMessage(msg + endMessage, threadID);
		} else if (event.mentions) {
			let msg = "";
			for (const id in event.mentions) {
				const findUser = arraySort.find(item => item.uid == id);
				msg += `\n${findUser.name} is ranked ${findUser.stt} with ${findUser.count} messages`;
			}
			api.sendMessage(msg, threadID);
		}
	} else {
		const findUser = arraySort.find(item => item.uid == senderID);
		return api.sendMessage(`You are ranked ${findUser.stt} and have sent ${findUser.count} messages in this group`, threadID);
	}
};
