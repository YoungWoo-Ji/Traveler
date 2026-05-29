const Database = require("better-sqlite3");
const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
  
	data: new SlashCommandBuilder()
		.setName('도장제거')
		.setDescription('수집한 도장을 제거합니다')
    .setDMPermission(false)
    .addIntegerOption(option=>
      option
        .setName('페이지')
        .setDescription('도장을 제거할 페이지')
        .setRequired(true)
        .setMinValue(1)
    ),
  permission:2,
	async execute(interaction) {
    const db = new Database('DB/user.db')
    const stampList = db.prepare('SELECT * FROM stamp WHERE user_id=?')
      .all(interaction.user.id)
    const page = interaction.options.getInteger('페이지')

    if(page>stampList.length){
      db.close()
      await interaction.reply({content:`⚠️ ${page}페이지에는 도장이 존재하지 않습니다.`,flags:MessageFlags.Ephemeral})
      return
    }
    const targetStamp = stampList[page-1] 
    const serverId = targetStamp.server_id
    db.prepare("DELETE FROM stamp WHERE user_id=? AND server_id=?").run(interaction.user.id,serverId)
    db.close()

    await interaction.reply({content:`✅ '${targetStamp.server_name}' 에서 받은 스탬프를 삭제하였습니다. (${page}페이지)`,flags:MessageFlags.Ephemeral})
  }
}