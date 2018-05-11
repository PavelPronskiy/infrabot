/*
 *
 * infrabot camshot, ver 0.1
 * avconv -y -f mjpeg -t 30 -r 3 -v debug -i http://camera.loc:8081/ 123.mp4
 */

module.exports = {

    id: 'camshot',
    defaultConfig: {
		avconv: [
			'-y',
			'-f', 'mjpeg',
			'-v', 'info',
			'-t', 50,
			'-r', 3,
			'-i', 'http://camera.loc:8081/',
			'/tmp/camshot.mp4'
		]
    },

    plugin(bot, config) {

		// const childProcess = require('child_process');

		bot.on(['/camshot'], function(msg) {
			// let hostname = execSync('hostname');
			// let message = '*' + 'report ' + hostname + '*' + '```' + uptime + '```';
			// var message = INFRABOT_PLUGINS;
			var message = '31231';

			/*childProcess.exec('bash ./setup.sh status', function (error, stdout, stderr) {
				var message = '``` ' + stdout + ' ```';
				return bot.sendMessage(msg.chat.id, message, {
					replyToMessage: msg.message_id,
					parseMode: 'Markdown'
				});
			}, {
				stdio: 'inherit',
				cwd: config.basePath
			});*/


			return bot.sendMessage(msg.chat.id, message, {
				replyToMessage: msg.message_id,
				parseMode: 'Markdown'
			});
		});
    }
};