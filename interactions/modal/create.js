const { MessageFlags, CachedManager, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const Canvas = require('@napi-rs/canvas')

//헥스코드 판별함수
function isHexColor(text) {
  if (typeof text !== 'string') return false;

  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(text);
}

function drawCircularText(ctx, text, centerX, centerY, radius, anchorAngle, isTop) {
  const chars = text.split('');
  // 글자 사이의 간격을 라디안 단위로 설정
  const angleStep = 0.4; 
  
  // 전체 문구의 시작 각도 계산 (기준 각도에서 전체 폭의 절반만큼 뒤에서 시작)
  const startAngle = anchorAngle - ((chars.length - 1) * angleStep) / 2;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if(!isTop){
    chars.reverse()
  }

  chars.forEach((char, i) => {
    // 각 글자의 절대 각도
    const charAngle = startAngle + (i * angleStep);

    ctx.save();
    ctx.translate(centerX, centerY); // 1. 캔버스 중심으로 이동
    ctx.rotate(charAngle);           // 2. 글자 위치만큼 회전
    
    // 3. 반지름만큼 이동 (위/아래 방향 결정)
    if (isTop) {
      ctx.translate(0, -radius);     // 위쪽은 y축 마이너스 방향으로
    } else {
      ctx.translate(0, radius);      // 아래쪽은 y축 플러스 방향으로
    }

    ctx.fillText(char, 0, 0);
    ctx.restore();
  });

  ctx.restore();
}

module.exports = {
  name:'create',
  async execute(interaction){
    
    //핵스코드 판별
    const color = interaction.fields.getTextInputValue('option1')
    if(!isHexColor(color)){
      await interaction.reply({content:'⚠️ 해당 색상 코드는 헥스코드가 아닙니다.',flags:MessageFlags.Ephemeral})
      return
    }

    //테두리 판별
    const circle = interaction.fields.getTextInputValue('option2')
    if(['1','2','3','4'].indexOf(circle)===-1){
      await interaction.reply({content:'⚠️ 테두리 옵션이 잘못되었습니다.',flags:MessageFlags.Ephemeral})
      return
    }

    //심볼 판별
    const simbol = interaction.fields.getTextInputValue('option3')
    const simbolList = ['게임기','책','음표','지구본','태양','달','나침반','돛','궁궐','자유의여신상','사원','에펠탑']
    if(simbolList.indexOf(simbol)===-1){
      await interaction.reply({content:'⚠️ 심볼 옵션이 잘못되었습니다.',flags:MessageFlags.Ephemeral})
      return
    }

    //상/하단 글씨
    const top = interaction.fields.getTextInputValue('option4')
    const bottom = interaction.fields.getTextInputValue('option5')

    const canvas = Canvas.createCanvas(500,500)
    const context = canvas.getContext('2d')
    //테두리
    const background = await Canvas.loadImage(`asset/원${circle}.png`)
    context.drawImage(background,0,0,canvas.width,canvas.height)
    //심볼
    const simbolImg = await Canvas.loadImage(`asset/${simbol}.png`)
    context.drawImage(simbolImg,168,168,160,160)
    //글꼴
    Canvas.GlobalFonts.registerFromPath('font/Nanum_Gothic/NanumGothic-ExtraBold.ttf','NanumGothic')
    context.font = 'bold 40px NanumGothic'
    //원형 상단 글씨
    if(top){
      drawCircularText(context,top,250,260,120,0,true)
    }
    if(bottom){
      drawCircularText(context,bottom,250,250,120,0,false)
    }
    
    //색 입히기
    context.globalCompositeOperation = 'source-atop'
    context.fillStyle = color
    context.fillRect(0,0,canvas.width,canvas.height)
    context.globalCompositeOperation = 'source-over'

    const result = new AttachmentBuilder(await canvas.encode('png'),{name:'result.png'})

    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle('🖌️ 도장이 생성되었습니다!')
      .setDescription('아래 이미지를 우클릭해, 다운로드 해주세요.')
      .setImage('attachment://result.png')

    await interaction.reply({embeds:[embed],files:[result]})
  }
}