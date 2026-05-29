const Database = require('better-sqlite3')
const { EmbedBuilder } = require('discord.js')

module.exports = {
  name:'serverInfo',
  async execute(interaction){
    const serverId = interaction.guild.id
    const db = new Database('DB/user.db')
    
    const name = interaction.fields.getTextInputValue('name')
    const category = interaction.fields.getTextInputValue('category')
    const desc = interaction.fields.getTextInputValue('desc')
    const invite = interaction.fields.getTextInputValue('invite')
    const mission = interaction.fields.getTextInputValue('mission').length>0?interaction.fields.getTextInputValue('mission'):'등록된 미션이 없습니다.'
    
    db.prepare(`INSERT INTO server_info (server_id,name,category,desc,mission,invite) VALUES (?,?,?,?,?,?) 
      ON CONFLICT(server_id) DO UPDATE SET
      name = excluded.name,
      category = excluded.category,
      desc = excluded.desc,
      mission = excluded.mission,
      invite = excluded.invite`)
      .run(serverId,name,category,desc,mission,invite)
    db.close()
    const embed = new EmbedBuilder()
      .setTitle('🌐 서버 정보 등록 완료!')
      .setDescription('서버 정보가 등록되었습니다. 아래를 확인해보세요.')
      .setColor('Blue')
      .addFields(
        {name:'이름',value:name},
        {name:'초대링크',value:`https://discord.gg/${invite}`},
        {name:'카테고리',value:category},
        {name:'설명',value:desc},
        {name:'미션',value:mission}
      )
    
    await interaction.reply({embeds:[embed]})
  }
}