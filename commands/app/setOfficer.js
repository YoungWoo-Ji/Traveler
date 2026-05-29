const Database = require('better-sqlite3')
const {SlashCommandBuilder, PermissionFlagsBits, MessageFlags} = require('discord.js')

module.exports = {
  
	data: new SlashCommandBuilder()
		.setName('심사관등록')
		.setDescription('심사관을 맡을 유저을 등록합니다.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addUserOption(option=>
      option
        .setName('유저')
        .setDescription('심사관에 임명할 유저를 선택하세요.')
        .setRequired(true)
    ),
  permission:1,
	async execute(interaction) {
    const user = interaction.options.getUser('유저')
    
    const db = new Database('DB/user.db')

    //정보등록여부 확인
    const serverInfo = db.prepare('SELECT * FROM server_info WHERE server_id=?').get(interaction.guild.id)
    if(!serverInfo){
      db.close()
      await interaction.reply({content:'⚠️ 아직 서버 정보가 등록되지 않았습니다. `/정보등록` 명령어로 우선 서버정보를 등록해주세요.',flags:MessageFlags.Ephemeral})
      return
    }

    //등록여부 확인
    const find = db.prepare('SELECT * FROM officer WHERE user_id=? AND server_id=?').get(user.id,interaction.guild.id)
    if(find){
      db.close()
      await interaction.reply({content:'⚠️ 해당 유저는 이미 심사관에 등록되었습니다.',flags:MessageFlags.Ephemeral})
      return
    }

    //등록
    db.prepare('INSERT INTO officer (user_id,server_id) VALUES (?,?)').run(user.id,interaction.guild.id)
    db.close()

    await interaction.reply({content:`유저 <@${user.id}>을(를) 심사관에 등록하였습니다.`,flags:MessageFlags.Ephemeral})
  }
}