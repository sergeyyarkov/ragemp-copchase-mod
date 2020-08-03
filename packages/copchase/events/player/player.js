const copchaseConfig = require('../../copchase-config');

const { getDistance } = require('../../helpers/getDistance')

module.exports = ({ api, copchase }) => {
  const putIntoVehicleKey = Symbol('putIntoVehicle');

  mp.events.add('entityCreated', entity => {
    if (entity.type !== 'player') {
        return;
    }

    entity[putIntoVehicleKey] = entity.putIntoVehicle;
    entity.putIntoVehicle = (vehicle, seat) => {
        setTimeout(() => {
            entity[putIntoVehicleKey](vehicle, seat);
        }, 400);
    }; 
  })

  mp.events.add("playerExitVehicle", (player, vehicle, seat) => {

    if (copchase.isStarted && player.name === copchase.suspect.name) {
      player.giveWeapon(mp.joaat('weapon_pistol'), 25);

      copchase.players.forEach(_player => {
        if (_player.name !== copchase.suspect.name) {
          _player.giveWeapon(mp.joaat('weapon_pistol'), 50);
        }
      })
    } 
  })

  mp.events.add('playerEnterVehicle', (player, vehicle, seat) => {
    if (copchase.isStarted && player.name === copchase.suspect.name && seat === 0) {
      player.call('setCarHealth')
    }
    
    return false
  })

  /* 
    Player has been joined to the server
  */

  mp.events.add('playerJoin', player => {
    const candidate = api.players.filter(_player => _player.name === player.name)

    console.log(`[SERVER]: ${player.name} присоеденился к серверу!`);
    mp.players.forEach(_player => _player.outputChatBox(`!{orange}[SERVER]: !{1CD8FD}✋ [${player.id}: ${player.name}] !{white}присоеденился`))

    player.spawn(copchaseConfig.spawn)
    player.dimension = 0
    player.model = ped.skin[Math.floor(Math.random() * (722 - 35) + 35)]
    

    candidate <= 0
      ? player.call('playerJoin', [player, copchaseConfig.messages.register])
      : player.call('playerJoin', [player, `!{orange}[SERVER]: !{white}/login [пароль] !{green}для авторизации`])
  })

  mp.events.add("playerQuit", player => {
    if (copchase.isStarted) {
      if (player.name === copchase.suspect.name) copchase.stopGame('police')
      
      const policemanIndex = copchase.players.findIndex(_player => _player.name === player.name && _player.name !== copchase.suspect.name)

      if (policemanIndex !== -1) copchase.players.splice(policemanIndex, 1)
      if (copchase.players.length <= 1 && copchase.suspect !== null) copchase.stopGame('suspect')
    }
    
    api.delAuthPlayer(player) // удаляем игрока из массива с авторизованными игроками
    console.log(`[SERVER]: игрок ${player.name} отсоеденился`)
    console.log(api.authenticatedPlayers)
    mp.players.forEach(_player => _player.outputChatBox(`!{orange}[SERVER]: !{1CD8FD}[${player.name}] !{white}покинул нас`))
  })

  /* 
    When player send message to the chat
  */
  mp.events.add("playerChat", (player, message) => {
    if (!api.isPlayerLoggedIn(player)) {
      player.outputChatBox(copchaseConfig.messages.notAuthenticated)
      return false
    }

    mp.players.forEach(_player => _player.outputChatBox(`!{orange}[${player.id}]: !{1CD8FD}${player.name} !{white}${message}`))
  })

  /* 
    Unknown command in chat
  */

  mp.events.add('playerCommand', (player, command) => {
    if (player.health <= 0) return false
    player.outputChatBox(`!{orange}[SERVER]: !{red}Команды "${command}" не существует`)
    player.outputChatBox(`!{orange}[SERVER]: !{red}Нажмите !{1CD8FD}H !{red}для помощи`)
  })

  mp.events.add('onPlayerDamage', (player) => {
    if (copchase.isStarted) {
      return false
    }
    
    player.call('setInv', [player])
  })
  /* 
    On Player death
  */

  mp.events.add('playerDeath', player => {
    if (copchase.isStarted) {
      if (player.name === copchase.suspect.name) copchase.stopGame('police')
    
      const policemanIndex = copchase.players.findIndex(_player => _player.name === player.name && _player.name !== copchase.suspect.name)

      if (policemanIndex !== -1) copchase.players.splice(policemanIndex, 1)
      if (copchase.players.length <= 1 && copchase.suspect !== null) copchase.stopGame('suspect')
    }

    player.removeAllWeapons()
  
    mp.players.forEach(_player => _player.notify(`Игрок ${player.name} погиб`))

    setTimeout(() => {
      // player.health = 100
      // player.position = copchaseConfig.spawn
      player.spawn(copchaseConfig.spawn)
      player.dimension = 0
      player.call('setInv', [player])
    }, 3000)
  })

  mp.events.add('voiceEnable', player => {
    mp.players.forEach(_player => {
      let distance = getDistance(_player.position, player.position)
      if(player == _player) return false;

      if (distance <= 10) {
        player.enableVoiceTo(_player);
        console.log(`${player.name} что-то говорит`)
      }
    })
  })

  mp.events.add('voiceDisable', player => {
    mp.players.forEach(_player => {
      if(player == _player) return false;
      
      player.disableVoiceTo(_player);
      console.log(`${player.name} перестал говорить`)
    })
  })

  mp.events.add('[ui:showHelpPanel]', player => {
    if (!api.isPlayerLoggedIn(player)) {
      player.outputChatBox(copchaseConfig.messages.notAuthenticated)
      return false
    }

    player.call('onShowHelpPanel')
  })
}

