/*
 *
 * infrabot uptime
 *
 */

module.exports = {

    id: 'uptime',
    defaultConfig: null,

    plugin(bot, config) {
        const { regExpEvents } = config;
        const execSync = require('child_process').execSync;
		bot.on(['/uptime'], function(msg) {
			let uptime = execSync('uptime');
			let hostname = execSync('hostname');

			return sendTelegramMessage({
				message: '*' + 'report ' + hostname + '*' +
					'```' + uptime + '```',
				chatID: msg.chat.id,
				replyToMessage: msg.message_id
			});
		});
    }
};
