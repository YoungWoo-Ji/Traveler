const { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, SeparatorSpacingSize, MediaGalleryBuilder, ButtonBuilder, ButtonStyle, SectionBuilder, MessageFlags, AttachmentBuilder, MediaGalleryItemBuilder } = require("discord.js");

module.exports = {
  
	data: new SlashCommandBuilder()
		.setName('도장생성')
		.setDescription('새로운 도장을 생성합니다.')
    .setDMPermission(false),
  permission:1,
	async execute(interaction) {
    const container = new ContainerBuilder()
    const title = new TextDisplayBuilder()
      .setContent('# 도장 생성기\nTraveler에서 제공하는 기본 도장 생성기입니다.\n아래 내용을 참고하여 도장 생성 옵션을 선택해주세요.')
    const option1 = new TextDisplayBuilder()
      .setContent('## 1. 테마색상 선택\n헥스코드로 테마 색상을 입력해주세요.\n예) #ff0000')
    const option2 = new TextDisplayBuilder()
      .setContent('## 2. 테두리 선택\n4가지 테두리 중 하나를 선택해주세요.')
    const option3 = new TextDisplayBuilder()
      .setContent('## 3. 심볼 선택\n12가지 심볼 중 하나를 선택해주세요.')
    const option4 = new TextDisplayBuilder()
      .setContent('## 4. 상/하단 문구 선택\n도장에 들어갈 상/하단 문구를 선택해주세요.\n예) 아름다운/우리나라')
    const start = new TextDisplayBuilder()
      .setContent('옆에 있는 버튼을 누르고, 원하는 옵션을 입력해주세요.')
    const button = new ButtonBuilder()
      .setStyle(ButtonStyle.Primary)
      .setCustomId('create')
      .setLabel('시작하기')
      .setEmoji('▶️')

    const foot = new SectionBuilder()
      .addTextDisplayComponents(start)
      .setButtonAccessory(button)

    container
      .setAccentColor(3447003)
      //제목
      .addTextDisplayComponents(title)
      .addSeparatorComponents(sep=>sep.setSpacing(SeparatorSpacingSize.Large))
      //옵션1 설명
      .addTextDisplayComponents(option1)
      .addSeparatorComponents(sep=>sep.setSpacing(SeparatorSpacingSize.Large))
      //옵션2 설명
      .addTextDisplayComponents(option2)
      .addMediaGalleryComponents(
        new MediaGalleryBuilder()
          .addItems(
            new MediaGalleryItemBuilder().setURL('attachment://option2.png')
          )
      )
      .addSeparatorComponents(sep=>sep.setSpacing(SeparatorSpacingSize.Large))
      //옵션3 설명
      .addTextDisplayComponents(option3)
      .addMediaGalleryComponents(
        new MediaGalleryBuilder()
          .addItems(
            new MediaGalleryItemBuilder().setURL('attachment://option3.png')
          )
      )
      .addSeparatorComponents(sep=>sep.setSpacing(SeparatorSpacingSize.Large))
      //옵션4 설명
      .addTextDisplayComponents(option4)
      .addSeparatorComponents(sep=>sep.setSpacing(SeparatorSpacingSize.Large))
      //시작하기
      .addSectionComponents(foot)

    const option2_img = new AttachmentBuilder('asset/가이드1.png',{name:'option2.png'})
    const option3_img = new AttachmentBuilder('asset/가이드2.png',{name:'option3.png'})

    await interaction.reply({components:[container],files:[option2_img,option3_img],flags:MessageFlags.IsComponentsV2})
  }
}