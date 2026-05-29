const Database = require("better-sqlite3");
const { ContextMenuCommandBuilder, ApplicationCommandType, PermissionFlagsBits, MessageFlags, ModalBuilder, LabelBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

//이미지 url 판별함수
function isPngUrl(str) {
  if (typeof str !== 'string') return false;

  try {
    const url = new URL(str);
    return /\.png$/i.test(url.pathname);
  } catch {
    return false;
  }
}

module.exports = {
  
  data: new ContextMenuCommandBuilder()
    .setName('도장등록하기')
    .setType(ApplicationCommandType.Message)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  permission:1,
  async execute(interaction) {
    const msg = interaction.targetMessage
    let url

    //이미지(혹은 링크)가 맞는지 확인
    if(msg.attachments.size === 0 && !isPngUrl(msg.content)){
      await interaction.reply({content:'⚠️ 해당 메시지는 도장으로 등록할 수 없습니다. png 형식의 파일 혹은 이미지 링크를 등록해주세요.',flags:MessageFlags.Ephemeral})
      return
    }

    //이미지 일때 파일형식 확인 
    if(msg.attachments.size !== 0){
      const attachment = msg.attachments.values().next().value
      const file_type = attachment.name.split('.')[1]

      //파일이 png인지 확인
      if(file_type!=='png'){
        await interaction.reply({content:'⚠️ 파일 형식은 png만 가능합니다.',flags:MessageFlags.Ephemeral})
        return
      }

      url = attachment.url
    }
    else{
      url = msg.content
    }

    //이미지 등록
    const db = new Database('DB/user.db')
    db.prepare('INSERT INTO server_stamp (server_id,url,color) VALUES (?,?,?) ON CONFLICT(server_id) DO UPDATE SET url=excluded.url')
      .run(interaction.guild.id,url,'#000000')
    db.close()

    //색상코드 모달 전송
    const modal = new ModalBuilder().setCustomId('upload').setTitle('도장 등록하기')
    const colorInput = new TextInputBuilder()
      .setStyle(TextInputStyle.Short)
      .setCustomId('colorInput')
      .setPlaceholder('예)#FFFFFF')
      .setMaxLength(7)
      .setMinLength(4)
      .setRequired(true)
    const colorLabel = new LabelBuilder()
      .setLabel('도장의 주요 색상을 입력해주세요.(헥스코드)')
      .setDescription('해당 색상코드는 메인 도장 하단에 찍힐 날짜 도장의 색상을 결정합니다.')
      .setTextInputComponent(colorInput)
    modal.addLabelComponents(colorLabel)

    await interaction.showModal(modal)
  }
}