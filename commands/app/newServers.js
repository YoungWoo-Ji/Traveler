const Database = require('better-sqlite3')
const {PermissionFlagsBits, SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, SeparatorSpacingSize, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags} = require('discord.js')

module.exports = {
  
	data: new SlashCommandBuilder()
		.setName('추천서버')
		.setDescription('도장을 받을 수 있는 다른 서버를 추천합니다.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  permission:1,
	async execute(interaction) {

    const container = new ContainerBuilder()
      .setAccentColor(3447003)
    const title = new TextDisplayBuilder()
      .setContent('# 🌐 추천 서버 목록')
    container.addTextDisplayComponents(title)
    
    //서버 목록
    const db = new Database('DB/user.db')
    const date = new Date()
    let serverList = db.prepare('SELECT * FROM server_list WHERE date>?')
      .all(date.getTime())
    
    if(serverList.length===0){
      container
      .addSeparatorComponents(sep=>sep.setSpacing(SeparatorSpacingSize.Large))
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent('## 현재 등록된 서버가 없습니다...')
      )
    }else{
      let i = 0
      while(serverList.length>0&&i<3){
        i++
        const server = serverList.splice(Math.floor(Math.random()*serverList.length),1)[0]
        container
          .addSeparatorComponents(sep=>sep.setSpacing(SeparatorSpacingSize.Large))
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `## ${server.name}\n\n`+
              `**카테고리**: ${server.category}\n`+
              `**소개**: ${server.desc}\n`+
              `**미션**: ${server.mission}`
            )
          )
          .addActionRowComponents(
            new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setLabel('참여하기')
                  .setEmoji('▶️')
                  .setURL(`https://discord.gg/${server.invite}`)
                  .setStyle(ButtonStyle.Link)
              )
          )
      }
    }

    await interaction.reply({components:[container],flags:MessageFlags.IsComponentsV2})
  }
}