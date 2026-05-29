const { SlashCommandBuilder, EmbedBuilder,ActionRowBuilder,ButtonBuilder,ButtonStyle,MessageFlags } = require("discord.js");
const Database = require('better-sqlite3')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('여권제거')
		.setDescription('여권을 제거합니다')
    .setDMPermission(false),
  permission:2,
	async execute(interaction) {
    const db = new Database('DB/user.db')
    const find = db.prepare('SELECT * FROM user WHERE user_id=?')
    const user = find.get(interaction.user.id)
    db.close()
    //동일 회원 존재여부 확인
    if (!user){
      await interaction.reply({flags:MessageFlags.Ephemeral ,content:'⚠️ 발급된 여권이 없습니다.'})
      return
    }

    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle("정말로 그만두시겠습니까?")
      .setDescription('여권 제거 시 수집한 도장은 모두 삭제되고, 이는 복구할 수 없습니다.')
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`cancel-${interaction.user.id}`)
          .setLabel('아니요')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('confirm-'+interaction.user.id)
          .setLabel('네')
          .setStyle(ButtonStyle.Secondary)
      )
    
    interaction.reply({embeds:[embed],components:[row]})
  }
}