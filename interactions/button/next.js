const Database = require('better-sqlite3')
const {AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags} = require('discord.js')
const Canvas = require('@napi-rs/canvas')
const {request} = require('undici')

module.exports = {
  name:"next",
  permission:2,
  async execute(interaction){
    const page = Number(interaction.customId.split('-')[2])

    const db = new Database('DB/user.db')
    const stampList = db.prepare("SELECT * FROM stamp WHERE user_id=?")
      .all(interaction.user.id)
    db.close()
    
    let pair
    if(page%2===1){
      pair = [page,page+1]
    }else{
      pair = [page-1,page]
    }

    if(pair[0]>stampList.length||pair[0]<1){
      await interaction.reply({content:'⚠️ 여권에 아직 도장이 없거나, 해당 페이지에 도장이 없습니다.',flags:MessageFlags.Ephemeral})
      return
    }

    const stamp1 = stampList[pair[0]-1]
    let stamp2 = null
    if(pair[1]<=stampList.length){
      stamp2 = stampList[pair[1]-1]
    }

    //시간 끌기
    await interaction.deferReply()

    //캔버스 생성
    const canvas = Canvas.createCanvas(577,433)
    const context = canvas.getContext('2d')

    //폰트설정
    Canvas.GlobalFonts.registerFromPath('font/Nanum_Gothic/NanumGothic-ExtraBold.ttf','NanumGothic')
    context.font = 'bold 35px NanumGothic'
    context.textAlign='center'
    context.textBaseline='middle'

    //페이지 찍기
    context.fillStyle = '#b4d1e4ab'
    context.fillText(`${pair[0]}`,42,40)
    context.fillText(`${pair[1]}`,canvas.width-42,40)

    //날짜 도장 찍기1
    const subStampImg = await Canvas.loadImage('asset/날짜도장.png')
    context.drawImage(subStampImg,170,310,110,110)
    context.globalCompositeOperation = 'source-atop'
    context.fillStyle = stamp1.color
    context.fillRect(170,310,110,110)
    context.globalCompositeOperation = 'source-over'
    //도장 찍기1
    let stampImg1
    try{
      const {body} = await request(stamp1.img)
      stampImg1 = await Canvas.loadImage(await body.arrayBuffer())
    }catch(e){
      stampImg1 = await Canvas.loadImage('asset/오류.png')
    }
    context.drawImage(stampImg1,10,60,270,270)
    //날짜1
    context.font = 'bold 15px NanumGothic'
    const date1 = new Date(stamp1.date)
    context.fillText(`${date1.getFullYear()}-${String(date1.getMonth()+1).padStart(2,'0')}-${String(date1.getDate()).padStart(2,'0')}`,225,350)
    //길드 글씨1
    let fontSize = 30
    const text = stamp1.server_name
    do {
      context.font = `bold ${(fontSize -= 2)}px NanumGothic`
    } while (context.measureText(text).width > 90 && fontSize>=6)
    context.fillText(text,225,380)

    if(stamp2!==null){
      //날짜 도장 찍기2
      context.drawImage(subStampImg,450,310,110,110)
      context.globalCompositeOperation = 'source-atop'
      context.fillStyle = stamp2.color
      context.fillRect(450,310,110,110)
      context.globalCompositeOperation = 'source-over'
      //도장 찍기2
      let stampImg2
      try{
        const {body} = await request(stamp2.img)
        stampImg2 = await Canvas.loadImage(await body.arrayBuffer())
      }catch(e){
        stampImg2 = await Canvas.loadImage('asset/오류.png')
      }
      context.drawImage(stampImg2,290,60,270,270)
      //날짜2
      const date2 = new Date(stamp2.date)
      context.font = 'bold 15px NanumGothic'
      context.fillText(`${date2.getFullYear()}-${String(date2.getMonth()+1).padStart(2,'0')}-${String(date2.getDate()).padStart(2,'0')}`,505,350)
      //길드 글씨2
      let fontSize = 30
      const text = stamp2.server_name
      do {
        context.font = `bold ${(fontSize -= 2)}px NanumGothic`
      } while (context.measureText(text).width > 90 && fontSize>=6)
      context.fillText(text,505,380)
    }

    //밑에 배경깔기
    context.globalCompositeOperation = 'destination-over';
    const background = await Canvas.loadImage('asset/여권페이지.png')
    context.drawImage(background,0,0,canvas.width,canvas.height)

    const file = new AttachmentBuilder(await canvas.encode('png'),{name:'img.png'})

    //임베드
    const embed = new EmbedBuilder()
      .setTitle(`📘 ${interaction.member.displayName} 님의 여권`)
      .setColor('Blue')
      .setDescription(`${pair[0]}-${pair[1]} 페이지`)
      .setImage('attachment://img.png')

    //버튼
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('이전 페이지')
          .setCustomId(`next-${interaction.user.id}-${pair[0]-1}`)
          .setStyle(ButtonStyle.Primary)
          .setEmoji('◀️'),
        new ButtonBuilder()
          .setLabel('다음 페이지')
          .setCustomId(`next-${interaction.user.id}-${pair[1]+1}`)
          .setStyle(ButtonStyle.Primary)
          .setEmoji('▶️')
      )
    await interaction.editReply({embeds:[embed],files:[file],components:[row]})
  }
}