/*
    ICMP ping
*/

module.exports = function(telebot) {
	
	const execSync = require('child_process').execSync;
	var ping = require('ping');
	let hostname = execSync('hostname');

	telebot.on(['/ping'], function(msg) {
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
				message = (res.alive)
					? '*Host is online: ' + res.host + '*' + "\n"  +
						'```' + res.output + '```'
					: '*Host is down: ' + res.host + '*' + "\n"  +
						'```' + res.output + '```';
						
				return telebot.sendMessage(msg.chat.id, message, {
					replyToMessage: msg.message_id,
					parseMode: 'Markdown'
				});
			});
		} else {
			message = 'Host ' + '*' + hostname + '*' + ' reported:' + "\n" +
			'``` please use: /ping targethost {countNumber}```';
			return telebot.sendMessage(msg.chat.id, message, {
				replyToMessage: msg.message_id,
				parseMode: 'Markdown'
			});
		}
	});
};


