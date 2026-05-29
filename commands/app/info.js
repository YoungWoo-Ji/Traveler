const { SlashCommandBuilder, EmbedBuilder,ActionRowBuilder,ButtonBuilder,ButtonStyle } = require("discord.js");
const Database = require('better-sqlite3')
const { discord_invite_code,clientId } = require('../../config.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('어플정보')
		.setDescription('어플의 기본 정보를 제공합니다.')
    .setDMPermission(false),
  permission:1,
	async execute(interaction) {
    const client = interaction.client
    const db = new Database('DB/user.db')
    const users = db.prepare('SELECT id FROM user').all()
    db.close()
    //어플정보 업데이트
    await client.application.fetch()
    //제작일
    const createAt = new Date(client.user.createdAt)
    //임베드
    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle('✈️ Traveler 정보')
      .setDescription('트레블러 어플의 잡다한 정보들입니다.')
      .addFields(
        {name:'어플이름', value:`${client.user.username}`,inline:true},
        {name:'제작일', value:`${createAt.getFullYear()}년 ${createAt.getMonth()+1}월 ${createAt.getDate()}일`,inline:true},
        {name:'참여한 서버 수',value:`${interaction.client.guilds.cache.size}개`,inline:true},
        {name:'여행자 수', value:`${users.length}명`,inline:true},
        {name:'제작자',value:'**지영우**@jiyoungwoo',inline:true},
        {name:'핑',value:`${client.ws.ping}ms`,inline:true}
      )
      .setThumbnail(client.user.avatarURL())
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel('공식 디스코드')
          .setEmoji('🌏')
          .setURL('https://discord.gg/'+discord_invite_code),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel('초대링크')
          .setEmoji('📎')
          .setURL(`https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=8&integration_type=0&scope=bot+applications.commands`)
      )
    await interaction.reply({embeds:[embed],components:[row]})
  }
}