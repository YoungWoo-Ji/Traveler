const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  
	data: new SlashCommandBuilder()
		.setName('도움말')
		.setDescription('어플의 모든 명령어를 확인합니다.')
    .setDMPermission(false),
  permission:1, // 1:일반 커맨드, 2:회원전용 커맨드, 3:관리자서버 커맨드
	async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle('❓ 도움말')
      .setDescription('어플의 모든 명령어입니다.')
      .addFields(
        {name:'✈️ 여권',value:
          '`/여권발급`: 회원 정보를 등록합니다\n'+
          '`/여권제거`: 모든 회원 정보를 삭제합니다\n'+
          '`/프로필`: 내 정보를 확인합니다.\n'+
          '`/도장보기`: 수집한 도장을 확인합니다.\n'+
          '`/도장제거`: 수집한 도장을 제거합니다.\n'
        },
        {name:'🌐 서버',value:
          '`/서버정보`: 해당 서버의 정보를 제공합니다.\n'+
          '`/추천서버`: 도장을 받을 수 있는 다른 서버를 추천합니다.'
        },
        {name:'🖌️ 도장',value:
          '`/도장생성`: 새로운 도장을 생성합니다.\n'+
          '`/도장찍기`: 미션을 완료한 유저에게 도장을 찍어줍니다. (심사관 전용)'
        },
        {name:'⚙️ 서버관리 (관리자전용)',value:
          '`/도장등록`: 서버 도장 등록 방법을 제공합니다.\n'+
          '`/정보등록`: 서버의 기본정보를 등록합니다.\n'+
          '`/심사관등록`: 서버 도장을 관리하는 심사관을 등록합니다.\n'+
          '`/심사관제거`: 심사관 권한을 제거합니다.\n'+
          '`/서버홍보`: 24시간 동안 추천 서버 목록에 서버를 등록합니다.'
        },
        {
          name:'🎸 기타',value:
          '`/어플정보`: 어플에 관한 잡다한 정보를 제공합니다.\n'
        }
      )
    await interaction.reply({embeds:[embed]})
  } 
}