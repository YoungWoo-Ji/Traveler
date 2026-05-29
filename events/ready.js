const Database = require('better-sqlite3');
const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {

		// 상태 설정
		client.user.setPresence({
			activities: [{
				name:'지금 바로 /여권발급 입력!',
				type: ActivityType.Custom
			}],
			status:'online'
		})

		console.log('Deleting outdated server info..')
		const db = new Database('DB/user.db')
		const date = new Date().getTime()
		db.prepare('DELETE FROM server_list WHERE date<?').run(date)
		db.close()
		console.log('Complete!')

		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
