const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const Canvas = require('@napi-rs/canvas')
const { request } = require('undici')
const Database = require('better-sqlite3')

module.exports = {
  
	data: new SlashCommandBuilder()
		.setName('프로필')
		.setDescription('여행자의 신원 정보를 확인합니다.')
    .setDMPermission(false),
  permission:2,
	async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle(`📗 ${interaction.member.displayName} 님의 프로필`)
      .setDescription('여행자 여권 조회가 완료되었습니다!')
      .setColor('Blue')
      .setImage('attachment://img.png')
    
    //프로필 제작
    const canvas = Canvas.createCanvas(1024,905)
    const context = canvas.getContext('2d')
    const background = await Canvas.loadImage('asset/프로필.png')
    context.drawImage(background,0,0,canvas.width,canvas.height)

    const {body} = await request(interaction.user.displayAvatarURL({extension:'png'}))
    const avatar = await Canvas.loadImage(await body.arrayBuffer())

    context.drawImage(avatar,229,252,160,160)
    context.drawImage(avatar,239,535,160,160)

    Canvas.GlobalFonts.registerFromPath('font/Nanum_Gothic/NanumGothic-ExtraBold.ttf','NanumGothic')
    Canvas.GlobalFonts.registerFromPath('font/Nanum_Brush_Script/NanumBrushScript-Regular.ttf','NanumBrush')
    context.font = 'bold 25px NanumGothic'
    context.fillStyle = '#000000'
    context.fillText(interaction.member.displayName,500,571)
    context.fillText(interaction.user.id.slice(0,10),547,608)
    
    const db = new Database('DB/user.db')
    const data = db.prepare('SELECT * FROM user WHERE user_id=?').get(interaction.user.id)
    const stampList = db.prepare('SELECT server_id FROM stamp WHERE user_id=?').all(interaction.user.id)
    db.close()
    const date = new Date(data.date)
    const date_text = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
    context.fillText(date_text,522,643)
    //도장개수
    context.fillText(`${stampList.length} 개`,630,753)

    context.font = 'bold 40px NanumBrush'
    context.fillText('라온',500,390)

    //등급
    const passport_class = ['bronze','silver','gold','platinum','diamond']
    const index = (function getIndex(n){
      if(n<5) return 0
      if(n<20) return 1
      if(n<50) return 2
      if(n<100) return 3
      return 4
    })(stampList.length)
    const class_img = await Canvas.loadImage(`asset/${passport_class[index]}.png`)
    context.drawImage(class_img,480,677,175,55)

    const file = new AttachmentBuilder(await canvas.encode('png'),{name:'img.png'})

    await interaction.reply({embeds:[embed],files:[file]})
  }
}