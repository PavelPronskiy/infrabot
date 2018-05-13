/*
 *
 * infrabot update sources
 *
 */

module.exports = {

	id: 'botupdate',
	defaultConfig: {
		basePath: '/opt/infrabot/infrabot',
		nodeModulesBinPath: './node_modules/.bin',
		printHelp: '/update status -- get status' +
			'/update now -- get update and install'
	},

	plugin(bot, config) {
		// var execSync = require('child_process').execSync;
		const childProcess = require('child_process');
		// var pm2 = require('pm2');
		bot.on(['/update'], function(msg) {
			
			// var hostname = execSync('hostname');
			var method = msg.text.split(' ');
			var updateResult = 'No results.';

			if (typeof method[1] != 'undefined') {
				switch(method[1]) {
					case 'status':
						bot.sendMessage(msg.chat.id, 'Check new updates...').then(re => {
							childProcess.exec('bash ./setup.sh status', function (error, stdout, stderr) {
								return updateAfterStatus(msg.chat.id, re.message_id, stdout);
							}, {
								stdio: 'inherit',
								cwd: config.basePath
							});
						});
					break;
					case 'now':
						bot.sendMessage(msg.chat.id, 'Get new updates...').then(re => {
							console.log('Updating software');
							childProcess.exec('bash ./setup.sh update', function (error, stdout, stderr) {
								if (stdout.match(/New infrabot version/g)) {
									updateAfterStatus(msg.chat.id, re.message_id, stdout);
									return process.exit(0);
								} else {
									return updateAfterStatus(msg.chat.id, re.message_id, stdout);
								}
							}, {
								stdio: 'inherit',
								cwd: config.basePath
							});
						});
					break;
				}
			} else {
				return sendTelegramMessage({
					message: config.printHelp,
					chatID: msg.chat.id,
					replyToMessage: msg.message_id
				});
			}
		});

		function updateAfterStatus(chatId, messageId, stdout) {
			return bot.editMessageText(
				{chatId, messageId}, `${ stdout }`,
				{parseMode: 'Markdown'}
			).catch(error => console.log('Error:', error));
		}
	}
};