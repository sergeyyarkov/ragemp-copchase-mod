require('./ui/index') // setup nativeui

mp.gui.cursor.visible = false;

let freeze = true
let showHud = false

//mp.game.ui.displayHud(showHud);
mp.voiceChat.muted = false

mp.events.add('render', () => {

  // Default ui

  mp.game.graphics.drawText("copchase server", [0.9, 0.005], { 
    font: 2, 
    color: [255, 255, 255, 1000], 
    scale: [0.8, 0.8], 
    outline: true
  })
  mp.game.graphics.drawText("RageMP v1.1", [0.947, 0.050], { 
    font: 4, 
    color: [255, 255, 255, 1000], 
    scale: [0.5, 0.5], 
    outline: true
  })
  mp.game.graphics.drawText(`${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`, [0.24, 0.95], { 
    font: 4, 
    color: [255, 255, 255, 1000], 
    scale: [0.6, 0.6], 
    outline: true
  })
  if (mp.players.local.vehicle) {
    mp.game.graphics.drawText(`Engine health: ${mp.players.local.vehicle.getEngineHealth().toFixed()}`, [0.54, 0.95], { 
      font: 7, 
      color: [255, 255, 255, 1000], 
      scale: [0.6, 0.6], 
      outline: true
    })
  }
})

mp.events.add('setCarHealth', () => {
  if (mp.players.local.vehicle.getEngineHealth().toFixed() <= 500) {
    return false
  }

  mp.players.local.vehicle.setEngineHealth(500)
})


/*
  Admin events
*/

mp.events.add('onGodMode', (player, godmode) => player.setInvincible(godmode))

/*
  Player events
*/

mp.events.add("playerDeath", (player, reason, killer) => {
  mp.game.graphics.startScreenEffect("DeathFailNeutralIn", 3000, false)
  mp.game.gameplay.setFadeOutAfterDeath(false)
  mp.game.ui.displayHud(true)
  mp.game.ui.resetHudComponentValues(0)
})

mp.game.ui.displayHud(true)

mp.events.add('setInv', (player) => player.setInvincible(true))
mp.events.add('delInv', (player) => player.setInvincible(false))

mp.events.add("playerJoin", (player, message) => {
  player.freezePosition(freeze)
  mp.events.callRemote('onPlayerDamage')
  mp.gui.chat.push(message)
})

mp.events.add('login', player => {
  player.freezePosition(!freeze)
  //mp.game.ui.displayHud(!showHud)
})

// mp.keys.bind(0x58, true, function() {
//   mp.events.callRemote("voiceEnable", [mp.players.local]);
//   mp.players.local.voiceVolume = 1.0
// })

// mp.keys.bind(0x58, false, function() {
//   mp.events.callRemote("voiceDisable", [mp.players.local]);
// })
