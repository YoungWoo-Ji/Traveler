const Database = require('better-sqlite3')
const { SlashCommandBuilder, MessageFlags, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const Canvas = require('@napi-rs/canvas')
const {request} = require('undici')

module.exports = {
  
	data: new SlashCommandBuilder()
		.setName('도장찍기')
		.setDescription('유저에게 도장을 찍어줍니다.')
    .setDMPermission(false)
    .addUserOption(option=>
      option
        .setName('유저')
        .setDescription('도장을 찍어줄 유저를 선택하세요.')
        .setRequired(true)
    ),
  permission:1,
	async execute(interaction) {
    const db = new Database('DB/user.db')
    const isOfficer = db.prepare('SELECT * FROM officer WHERE server_id=? AND user_id=?')
      .get(interaction.guild.id,interaction.user.id)
    
    if(!isOfficer){
      db.close()
      await interaction.reply({content:'⚠️ 해당 명령어는 심사관만 쓸 수 있습니다.',flags:MessageFlags.Ephemeral})
      return
    }

    const user = interaction.options.getUser('유저')

    //등록된 유저인지 확인
    const isUserExist = db.prepare('SELECT * FROM user WHERE user_id=?')
      .get(user.id)
    if(!isUserExist){
      db.close()
      await interaction.reply({content:'⚠️ 해당 유저는 여권을 생성하지 않았습니다.',flags:MessageFlags.Ephemeral})
      return
    }

    //해당 서버 도장 확인
    const isStampExist = db.prepare('SELECT date FROM stamp WHERE server_id=? AND user_id=?')
      .get(interaction.guild.id,user.id)
    if(isStampExist){
      db.close()
      const date = new Date(isStampExist.date)
      await interaction.reply({content:`⚠️ 해당 유저는 서버에서 이미 도장을 받았습니다. (받은 날짜:${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')})`,flags:MessageFlags.Ephemeral})
      return
    }

    //생각중 상태
    await interaction.deferReply()

    //도장 정보 등록
    const date = new Date()
    const serverStamp = db.prepare('SELECT * FROM server_stamp WHERE server_id=?').get(interaction.guild.id)
    db.prepare('INSERT INTO stamp (user_id,server_id,server_name,date,img,color) VALUES (?,?,?,?,?,?)')
      .run(user.id,interaction.guild.id,interaction.guild.name,date.getTime(),serverStamp.url,serverStamp.color)
    const stampList = db.prepare('SELECT server_id FROM stamp WHERE user_id=?').all(user.id)
    db.close()
    
    //완료 임배드
    const embed = new EmbedBuilder()
      .setTitle('👮 심사 완료!')
      .setColor('Blue')
      .setDescription(`<@${user.id}> 님이 새로운 도장을 받았습니다!`)
      .addFields(
        {name:'심사관', value:`<@${interaction.user.id}>`},
        {name:'받은 날짜', value:`${date.getFullYear()}년 ${date.getMonth()+1}월 ${date.getDate()}일`},
        {name:'현재까지 모은 도장 수',value:`${stampList.length} 개`}
      )
      .setImage('attachment://img.png')
    
    //캔버스 생성
    const canvas = Canvas.createCanvas(413,578)
    const context = canvas.getContext('2d')
    //날짜 도장
    const subStampImg = await Canvas.loadImage('asset/날짜도장.png')
    context.drawImage(subStampImg,250,430,150,150)
    context.globalCompositeOperation = 'source-atop'
    context.fillStyle = serverStamp.color
    context.fillRect(250,430,150,150)
    context.globalCompositeOperation = 'source-over'
    //글씨
    Canvas.GlobalFonts.registerFromPath('font/Nanum_Gothic/NanumGothic-ExtraBold.ttf','NanumGothic')
    context.font = 'bold 20px NanumGothic'
    context.fillText(`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`,270,490)
    //길드 글씨 크기 맞추기
    let fontSize = 30
    const text = interaction.guild.name
    do {
			context.font = `bold ${(fontSize -= 2)}px NanumGothic`
	  } while (context.measureText(text).width > 120 && fontSize>=6)
    context.textAlign='center'
    context.textBaseline='middle'
    context.fillText(text,325,520)
    //도장 이미지
    let stampImg
    try{
      const {body} = await request(serverStamp.url)
      stampImg = await Canvas.loadImage(await body.arrayBuffer())
    }catch(e){
      stampImg = await Canvas.loadImage('asset/오류.png')
    }
    context.drawImage(stampImg,6,59,400,400)
    //밑에 배경깔기
    context.globalCompositeOperation = 'destination-over';
    const background = await Canvas.loadImage('asset/단일페이지.png')
    context.drawImage(background,0,0,canvas.width,canvas.height)
    
    const file = new AttachmentBuilder(await canvas.encode('png'),{name:'img.png'})
    
    await interaction.editReply({embeds:[embed],files:[file]})
  }
}