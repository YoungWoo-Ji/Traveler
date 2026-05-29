const {clientId,kbot_token} = require('../../config.json')

module.exports= {
  name:'서버수갱신',
  permission:1,
  async execute(interaction){
    const servers = interaction.client.guilds.cache
    const url = `https://koreanbots.dev/api/v2/bots/${clientId}/stats`
    
    await interaction.deferReply({ephemeral:true})
    
    const res = await fetch(url,{
      method:'POST',
      headers:{
        "Authorization":kbot_token,
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        "servers":servers.size,
        "shards":1
      })
    })

    

    if(res.status===200){
      await interaction.followUp({content:'✅ 성공적으로 업데이트 되었습니다!',ephemeral:true})
    }else if(res.status===429){
      await interaction.followUp({content:'⛔ 업데이트할 수 없습니다. 잠시 후 다시 시도해주세요.',ephemeral:true})
    }
  }
}