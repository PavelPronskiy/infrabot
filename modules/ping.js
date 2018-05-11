/*
    infrabot ICMP ping
*/

module.exports = {

    id: 'ping',
    defaultConfig: null,

    plugin(bot, config) {
		const execSync = require('child_process').execSync;
		var ping = require('ping');
		let hostname = execSync('hostname');

		bot.on(['/ping'], function(msg) {
			//console.log(msg);
			let targetHost = msg.text.split(' ')[1];
			let pingIterate = (typeof msg.text.split(' ')[2] === 'undefined') ? '3' : msg.text.split(' ')[2];
			let message = '';
			let pingOptions = {
				timeout: 2,
				extra: [ '-c', pingIterate ]
			};

			if (targetHost) {
				ping.promise.probe(targetHost, pingOptions).then(function(res){
					return sendTelegramMessage({
						message: (res.alive)
						? '*Host is online: ' + res.host + '*' + "\n"  +
							'```' + res.output + '```'
						: '*Host is down: ' + res.host + '*' + "\n"  +
							'```' + res.output + '```',
						chatID: msg.chat.id,
						replyToMessage: msg.message_id
					});
				});
			} else {
				return sendTelegramMessage({
					message: 'Host ' + '*' + hostname + '*' + ' reported:' + "\n" +
						'``` please use: /ping targethost {countNumber}```',
					chatID: msg.chat.id,
					replyToMessage: msg.message_id
				});
			}
		});
	}
};
