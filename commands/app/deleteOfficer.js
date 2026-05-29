const Database = require('better-sqlite3')
const {SlashCommandBuilder, PermissionFlagsBits, MessageFlags} = require('discord.js')

module.exports = {
  
	data: new SlashCommandBuilder()
		.setName('심사관제거')
		.setDescription('유저의 심사관 권한을 제거합니다')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addUserOption(option=>
      option
        .setName('유저')
        .setDescription('권한을 제거할 유저를 선택하세요.')
        .setRequired(true)
    ),
  permission:1,
	async execute(interaction) {
    const user = interaction.options.getUser('유저')
    
    const db = new Database('DB/user.db')
    const find = db.prepare('SELECT * FROM officer WHERE user_id=? AND server_id=?').get(user.id,interaction.guild.id)

    //등록여부 확인
    if(!find){
      db.close()
      await interaction.reply({content:'⚠️ 해당 유저는 심사관 권한이 없습니다.',flags:MessageFlags.Ephemeral})
      return
    }

    //제거
    db.prepare('DELETE FROM officer WHERE user_id=? AND server_id=?').run(user.id,interaction.guild.id)
    db.close()

    await interaction.reply({content:`유저 <@${user.id}>의 심사관 권한을 제거하였습니다.`,flags:MessageFlags.Ephemeral})
  }
}