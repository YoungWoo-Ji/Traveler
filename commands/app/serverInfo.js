const Database = require('better-sqlite3')
const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')

module.exports = {
  
	data: new SlashCommandBuilder()
		.setName('서버정보')
		.setDescription('해당 서버의 기본 정보를 제공합니다.')
    .setDMPermission(false),
  permission:1,
	async execute(interaction) {

    const db = new Database('DB/user.db')
    const serverInfo = db.prepare('SELECT * FROM server_info WHERE server_id=?').get(interaction.guild.id)
    //정보 등록 여부 확인
    if(!serverInfo){
      db.close()
      await interaction.reply('⚠️ 아직 서버 정보가 등록되지 않았습니다.')
      return
    }

    //생각중 상태표시
    await interaction.deferReply()
    //심사관 목록
    const officers = db.prepare('SELECT * FROM officer WHERE server_id=?').all(interaction.guild.id)
    let officerList = ''
    if(officers.length===0){
      officerList='심사관이 없습니다.'
    }else{
      const deleteOfficer = db.prepare('DELETE FROM officer WHERE server_id=? AND user_id=?')
      for(const officer of officers){
        const member = await interaction.guild.members.fetch(officer.user_id).catch(() => null)
        if(!member){
          deleteOfficer.run(officer.server_id,officer.user_id)
          officerList+=`- 알 수 없는 유저 (권한 삭제)\n`
        }else{  
          officerList+=`- ${member.displayName} (${member.user.tag})\n`
        }
      }
    }
    db.close()

    const embed = new EmbedBuilder()
      .setTitle('🌐 서버 정보')
      .setColor('Blue')
      .addFields(
        {name:'이름',value:serverInfo.name},
        {name:'카테고리',value:serverInfo.category},
        {name:'설명',value:serverInfo.desc},
        {name:'도장미션',value:serverInfo.mission},
        {name:'심사관',value:officerList}
      )

    await interaction.editReply({embeds:[embed]})
  }
}