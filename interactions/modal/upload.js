const Database = require("better-sqlite3");
const { MessageFlags,EmbedBuilder } = require("discord.js");

//헥스코드 판별함수
function isHexColor(text) {
  if (typeof text !== 'string') return false;

  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(text);
}


module.exports = {
  name:'upload',
  async execute(interaction){

    const serverId = interaction.guild.id
    const color = interaction.fields.getTextInputValue('colorInput')

    if(!isHexColor(color)){
      await interaction.reply({content:'⚠️ 해당 색상 코드는 헥스코드가 아닙니다.',flags:MessageFlags.Ephemeral})
      return
    }
    
    const db = new Database('DB/user.db')
    const url = db.prepare('SELECT url FROM server_stamp WHERE server_id=?')
      .get(serverId).url
    db.prepare('UPDATE server_stamp SET color=? WHERE server_id=?')
      .run(color,serverId)
    db.close()

    const embed = new EmbedBuilder()
      .setTitle('🖋️ 도장이 등록되었습니다!')
      .addFields(
        {name:'테마 색상',value:color},
        {name:'도장 이미지',value:'　'}
      )
      .setImage(url)
      .setColor('Blue')
      .setFooter({text:'주의: 외부 링크가 아닌 이미지 파일로 등록 시 이미지 손실의 가능성이 있습니다.'})
    
    await interaction.reply({embeds:[embed]})
  }
}