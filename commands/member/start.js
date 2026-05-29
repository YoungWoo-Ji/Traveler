const { SlashCommandBuilder, EmbedBuilder,MessageFlags, AttachmentBuilder } = require("discord.js");
const Database = require('better-sqlite3')

module.exports = {
  
	data: new SlashCommandBuilder()
		.setName('여권발급')
		.setDescription('새로운 여권을 발행합니다.')
    .setDMPermission(false),
  permission:1,
	async execute(interaction) {

    const db = new Database('DB/user.db')
    const find = db.prepare('SELECT * FROM user WHERE user_id=?')
    const user = find.get(interaction.user.id)

    //동일 회원 존재여부 확인
    if (user){
      db.close()
      await interaction.reply({flags:MessageFlags.Ephemeral, content:'⚠️ 이미 여권을 발행했습니다.'})
      return
    }

    const insert = db.prepare('INSERT INTO user (user_id,date) VALUES (?,?)')
    insert.run(interaction.user.id,Date.now())
    db.close
    
    const file = new AttachmentBuilder('asset/여권표지.png',{name:'img.png'})
    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle("✈️ 여권이 발급되었습니다!")
      .setDescription("여러 디스코드 서버를 여행하며, 다양하고 독특한 스탬프를 모아보세요.")
      .addFields(
        {name:"❓ 이제 뭘 해야하죠?", value:"- Traveler와 함께 디스코드 서버를 탐험하며, 다양한 스템프를 모아보세요!"},
        {name:"🌐 어느 서버에서 스탬프를 받을 수 있나요?", value:"- `/추천서버` 명령어로 도장을 받을 수 있는 서버를 확인해보세요."},
        {name:"🖐️ 우리 서버도 추천서버에 등재되고 싶어요!", value:"- `/정보등록` 후에 `/서버홍보`를 하시면 24시간 동안 추천서버에 등재됩니다."},
        {name:'📘 명령어는 어디서 보나요?', value:'- `/도움말` 명령어를 참고해주세요!'}
      )
      .setThumbnail('attachment://img.png')

		await interaction.reply({embeds:[embed],files:[file]});
  }
}