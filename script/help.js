module.exports.config = {
	name: 'help',
	version: '1.0.0',
	role: 0,
	hasPrefix: false,
	aliases: ['help'],
	description: "Beginner's guide",
	usage: "Help [page] or [command]",
	credits: 'Developer',
};

module.exports.run = async function ({
	api,
	event,
	enableCommands,
	args,
	Utils,
	prefix
}) {
	const input = args.join(' ');
	const commands = enableCommands[0].commands;
	const eventCommands = enableCommands[1].handleEvent;
	const commandsPerPage = 20;
	const totalCommands = commands.length;
	const totalPages = Math.ceil(totalCommands / commandsPerPage);

	try {
		if (!input) {
			const page = 1;
			let start = (page - 1) * commandsPerPage;
			let end = start + commandsPerPage;
			let helpMessage = `シ𝗔𝘂𝘁𝗼𝗯𝗼𝘁 𝗺𝗮𝗱𝗲 𝗯𝘆 𝗰𝗼𝗻\n\n====『 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧✨ 』====\n`;
			for (let i = start; i < Math.min(end, commands.length); i++) {
				helpMessage += `\n ⊂⊃ ${i + 1}✨   ${prefix}${commands[i]}\n\t`;
			}
			helpMessage += '\n\n====『𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗟𝗜𝗦𝗧✨』====\n\n';
			eventCommands.forEach((eventCommand, index) => {
				helpMessage += ` |\t⊂⊃${index + 1}.  ${prefix}${eventCommand}\n\n`;
			});
			helpMessage += `𝗣𝗮𝗴𝗲: <1/${totalPages}>\nTotal commands: ${totalCommands}\nTo view information about a specific command, type '${prefix}help [command name]'.\n𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗱 𝗯𝘆 𝗰𝗼𝗻𝗿𝗮𝗱𝗼`;
			api.sendMessage(helpMessage, event.threadID, event.messageID);
		} else if (!isNaN(input)) {
			const page = parseInt(input);
			if (page > 0 && page <= totalPages) {
				let start = (page - 1) * commandsPerPage;
				let end = start + commandsPerPage;
				let helpMessage = `シ𝗔𝘂𝘁𝗼𝗯𝗼𝘁 𝗺𝗮𝗱𝗲 𝗯𝘆 𝗰𝗼𝗻\n\n====『 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧✨ 』====\n`;
				for (let i = start; i < Math.min(end, commands.length); i++) {
					helpMessage += `\n ⊂⊃ ${i + 1}✨   ${prefix}${commands[i]}\n\t`;
				}
				helpMessage += '\n\n====『𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗟𝗜𝗦𝗧✨』====\n\n';
				eventCommands.forEach((eventCommand, index) => {
					helpMessage += ` |\t⊂⊃${index + 1}.  ${prefix}${eventCommand}\n\n`;
				});
				helpMessage += `𝗣𝗮𝗴𝗲: <${page}/${totalPages}>\nTotal commands: ${totalCommands}\nTo view information about a specific command, type '${prefix}help [command name]'.\n𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗱 𝗯𝘆 𝗰𝗼𝗻𝗿𝗮𝗱𝗼`;
				api.sendMessage(helpMessage, event.threadID, event.messageID);
			} else {
				api.sendMessage(`Invalid page number. Please choose a page between 1 and ${totalPages}.`, event.threadID, event.messageID);
			}
		} else {
			const command = [...Utils.handleEvent, ...Utils.commands].find(([key]) => key.includes(input?.toLowerCase()))?.[1];
			if (command) {
				const {
					name,
					version,
					role,
					aliases = [],
					description,
					usage,
					credits,
					cooldown,
					hasPrefix
				} = command;
				const roleMessage = role !== undefined ? (role === 0 ? '➛ Permission: user' : (role === 1 ? '➛ Permission: admin' : (role === 2 ? '➛ Permission: thread Admin' : (role === 3 ? '➛ Permission: super Admin' : '')))) : '';
				const aliasesMessage = aliases.length ? `➛ Aliases: ${aliases.join(', ')}\n` : '';
				const descriptionMessage = description ? `Description: ${description}\n` : '';
				const usageMessage = usage ? `➛ Usage: ${usage}\n` : '';
				const creditsMessage = credits ? `➛ Credits: ${credits}\n` : '';
				const versionMessage = version ? `➛ Version: ${version}\n` : '';
				const cooldownMessage = cooldown ? `➛ Cooldown: ${cooldown} second(s)\n` : '';
				const message = ` 「 Command 」\n\n➛ Name: ${name}\n${versionMessage}${roleMessage}\n${aliasesMessage}${descriptionMessage}${usageMessage}${creditsMessage}${cooldownMessage}`;
				api.sendMessage(message, event.threadID, event.messageID);
			} else {
				api.sendMessage('Command not found☹.', event.threadID, event.messageID);
			}
		}
	} catch (error) {
		console.log(error);
	}
};
