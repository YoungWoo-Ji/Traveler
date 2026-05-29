const { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('서버')
    .setDescription('현재 봇이 참여중인 서버를 확인합니다.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  permission:3,
  onlyGuild:true,
  async execute(interaction){
    await interaction.client.guilds.fetch()
    const serverList = interaction.client.guilds.cache

    let list = `총 서버 수: ${serverList.size}`

    const embed = new EmbedBuilder()
      .setTitle('서버 수')
      .setDescription(list)
      .setColor('Blue')
    
    const button = new ButtonBuilder()
      .setCustomId('서버수갱신-'+interaction.user.id)
      .setEmoji('🔃')
      .setLabel('서버 수 업데이트')
      .setStyle(ButtonStyle.Secondary)
    const row = new ActionRowBuilder()
      .addComponents(button)
    await interaction.reply({embeds:[embed],components:[row]})
  }
}