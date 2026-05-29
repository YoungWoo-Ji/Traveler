const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  
	data: new SlashCommandBuilder()
		.setName('도장등록')
		.setDescription('서버 도장 등록 방법을 확인합니다.')
    .setDMPermission(false),
  permission:1,
	async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🖋️ 서버 도장 등록방법')
      .setDescription('서버 도장 등록 도움말입니다.')
      .setColor('Blue')
      .addFields(
        {name:'1. 도장 파일 올리기',value:
          '서버 도장으로 설정할 이미지 파일 혹은 이미지 링크(추천)를 봇이 접근할 수 있는 재널에 올려주세요.\n'+
          '(png 형식, 가로세로 1:1 비율, 배경은 투명하게)'
        },
        {name:'2. 해당 이미지(혹은 링크 메시지) 우클릭하기',value:
          '해당 파일(혹은 링크)을 우클릭 후 `앱 > Traveler > 도장등록하기` 을 차례로 클릭해주세요.'
        },
        {name:'3. 색상코드 입력',value:
          '2번을 수행한 이후 나오는 입력란에 도장의 테마색상을 입력해주세요.'
        },
        {name:'저희는 서버 도장 같은게 딱히 없는데요?',value:
          'Traveler에서 기본적인 도장 생성기를 제공해드리고 있습니다!\n'+
          '`/도장생성` 을 입력해보세요.'
        }
      )
    await interaction.reply({embeds:[embed]})
  }
}