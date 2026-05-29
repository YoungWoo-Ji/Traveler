const { EmbedBuilder } = require('discord.js')

module.exports = {
  name:"cancel",
  permission:2,
  async execute(interaction){

    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle('여권 제거 절차가 취소되었습니다.')
      .setDescription('Traveler와 함께 앞으로 더 많은 추억을 기록해보세요!')

    await interaction.update({embeds:[embed],components:[]})
  }
}