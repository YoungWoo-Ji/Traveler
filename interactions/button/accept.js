const { EmbedBuilder, MessageFlags } = require('discord.js')
const Database = require('better-sqlite3')

module.exports = {
  name:"confirm",
  permission:2,
  async execute(interaction){
    const db = new Database('DB/user.db')
    const find = db.prepare('SELECT * FROM user WHERE user_id=?')
    const user = find.get(interaction.user.id)

    //동일 회원 존재여부 확인
    if (!user){
      db.close()
      await interaction.reply({flags:MessageFlags.Ephemeral ,content:'⚠️ 발급된 여권이 없습니다.'})
      return
    }

    //user에서 삭제
    db.prepare('DELETE FROM user WHERE user_id=?')
      .run(interaction.user.id)
    //stamp에서 삭제
    db.prepare("DELETE FROM stamp WHERE user_id=?")
      .run(interaction.user.id)
    
    db.close()

    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle('여권이 제거되었습니다.')
      .setDescription('그동안 Traveler와 함께해주셔서 감사했습니다.')

    await interaction.update({embeds:[embed],components:[]})
  }
}