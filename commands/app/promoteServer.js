const Database = require('better-sqlite3')
const {SlashCommandBuilder, PermissionFlagsBits,MessageFlags} = require('discord.js')

module.exports = {
  
	data: new SlashCommandBuilder()
		.setName('서버홍보')
		.setDescription('서버를 24시간 동안 홍보 목록에 추가합니다.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  permission:1,
	async execute(interaction) {
    const db = new Database('DB/user.db')

    //서버정보 등록 여부 확인
    const isServerInfoExist = db.prepare('SELECT * FROM server_info WHERE server_id=?')
      .get(interaction.guild.id)
    if(!isServerInfoExist){
      db.close()
      await interaction.reply({content:'⚠️ 아직 서버 정보가 등록되지 않았습니다. `/정보등록` 명령어로 우선 서버정보를 등록해주세요.',flags:MessageFlags.Ephemeral})
      return
    }

    //이미 목록에 있는지 확인
    const date = new Date()
    const isServerAlreadyListed = db.prepare('SELECT server_id from server_list WHERE server_id=? AND date>?')
      .get(interaction.guild.id,date.getTime())
    if(isServerAlreadyListed){
      db.close()
      await interaction.reply({content:'⚠️ 이미 서버가 추천목록에 있습니다.',flags:MessageFlags.Ephemeral})
      return
    }

    //서버 홍보 목록에 추가
    const serverInfo = db.prepare('SELECT * FROM server_info WHERE server_id=?').get(interaction.guild.id)
    const day = 60_000*60*24
    db.prepare(`INSERT INTO server_list (server_id,name,category,desc,mission,invite,date) VALUES (?,?,?,?,?,?,?) 
      ON CONFLICT(server_id) DO UPDATE SET
      name = excluded.name,
      category = excluded.category,
      desc = excluded.desc,
      mission = excluded.mission,
      invite = excluded.invite,
      date = excluded.date,
      report = 0`)
      .run(serverInfo.server_id,serverInfo.name,serverInfo.category,serverInfo.desc,serverInfo.mission,serverInfo.invite,date.getTime()+day)
    const due_date = new Date(date.getTime()+day)
    await interaction.reply({content:`✅ 추천서버 목록에 등재되었습니다! (만료기간:${due_date.getMonth()+1}월 ${due_date.getDate()}일 ${due_date.getHours()}시 ${due_date.getMinutes()}분)`,flags:MessageFlags.Ephemeral})
  }
}