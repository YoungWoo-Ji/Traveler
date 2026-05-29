const Database = require('better-sqlite3')
const { ModalBuilder,SlashCommandBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle, LabelBuilder, MessageFlags } = require('discord.js')

module.exports = {
  
	data: new SlashCommandBuilder()
		.setName('정보등록')
		.setDescription('서버의 기본 정보를 등록합니다.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  permission:1,
	async execute(interaction) {

    //도장 등록 여부 확인
    const db = new Database('DB/user.db')
    const find = db.prepare('SELECT * FROM server_stamp WHERE server_id=?').get(interaction.guild.id)
    db.close()
    if(!find){
      await interaction.reply({content:'⚠️ 아직 서버 도장이 등록되지 않았습니다. `/도장등록` 명령어로 우선 서버도장을 등록해주세요.',flags:MessageFlags.Ephemeral})
      return
    }
    
    //정보입력 모달
    const modal = new ModalBuilder()
      .setCustomId('serverInfo')
      .setTitle('서버 정보 입력')

    const name = new TextInputBuilder()
      .setStyle(TextInputStyle.Short)
      .setCustomId('name')
      .setMinLength(1)
      .setMaxLength(20)
      .setRequired(true)
    
    const invite = new TextInputBuilder()
      .setStyle(TextInputStyle.Short)
      .setCustomId('invite')
      .setMaxLength(10)
      .setMaxLength(10)
      .setRequired(true)

    const category_example = ['게임','음악','친목','연애','IT','커뮤니티','봇']
    const category = new TextInputBuilder()
      .setStyle(TextInputStyle.Short)
      .setCustomId('category')
      .setMinLength(1)
      .setMaxLength(10)
      .setRequired(true)
      .setPlaceholder(`예) ${category_example[Math.floor(Math.random()*category_example.length)]}`)
    
    const desc = new TextInputBuilder()
      .setStyle(TextInputStyle.Paragraph)
      .setCustomId('desc')
      .setMinLength(1)
      .setRequired(true)
    
    const mission_example = ['채팅채널에 메시지 올리기','커뮤니티 정기모임 참석하기','오늘 찍은 사진 올리기','좋아하는 노래 공유하기','방장과의 끝말잇기에서 승리하기','게임 서버 참여하기']
    const mission = new TextInputBuilder()
      .setStyle(TextInputStyle.Paragraph)
      .setCustomId('mission')
      .setPlaceholder(`예) ${mission_example[Math.floor(Math.random()*mission_example.length)]}`)
      .setRequired(false)
    
    const label1 = new LabelBuilder()
      .setLabel('서버이름')
      .setTextInputComponent(name)
    const label2 = new LabelBuilder()
      .setLabel('초대코드')
      .setDescription('디스코드 서버 초대 코드를 입력해주세요. (예:mTBbw9TaaP)')
      .setTextInputComponent(invite)
    const label3 = new LabelBuilder()
      .setLabel('카테고리')
      .setTextInputComponent(category)
    const label4 = new LabelBuilder()
      .setLabel('설명')
      .setTextInputComponent(desc)
    const label5 = new LabelBuilder()
      .setLabel('미션')
      .setDescription('도장을 받기 위한 미션을 입력해주세요. (선택)')
      .setTextInputComponent(mission)
    
    modal.addLabelComponents(label1,label2,label3,label4,label5)

    await interaction.showModal(modal)
  }
}