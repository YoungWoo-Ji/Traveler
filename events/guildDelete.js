const { Events } = require("discord.js");
const Database = require('better-sqlite3')

module.exports = {
  name:Events.GuildDelete,
  async execute(guild){
    const id = guild.id
    const db = new Database('DB/user.db')
    
    //officer r에서 삭제
    db.prepare('DELETE FROM officer WHERE server_id=?')
      .run(id)
    //server_info 에서 삭제 
    db.prepare('DELETE FROM server_info WHERE server_id=?')
      .run(id)
    //server_list 에서 삭제
    db.prepare('DELETE FROM server_list WHERE server_id=?')
      .run(id)
    //server_stamp 에서 삭제
    db.prepare('DELETE FROM server_stamp WHERE server_id=?')
      .run(id)
   
    db.close()

  }
}