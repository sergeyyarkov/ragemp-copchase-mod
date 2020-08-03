const copchaseConfig = require('../../copchase-config')
require('../../events/skin')

module.exports = ({ api }) => {
  mp.events.addCommand('skin', (player, model) => {
    if (!api.isPlayerLoggedIn(player)) {
      player.outputChatBox(copchaseConfig.messages.notAuthenticated)
      return false
    }

    if (!api.isPlayerAdmin(player)) {
      player.outputChatBox(copchaseConfig.messages.notAvailable)
      return false
    }

    if (model >= 722 || !model || isNaN(model)) player.outputChatBox('!{orange}[SERVER]: !{white}/skin [0-722]')

    player.model = ped.skin[model]
  })
  /* 
    Check if player admin
    !auth
  */

  mp.events.addCommand('admin', (player) => {

    if (!api.isPlayerLoggedIn(player)) {
      player.outputChatBox(copchaseConfig.messages.notAuthenticated)
      return false
    }

    if (!api.isPlayerAdmin(player)) {
      player.outputChatBox(copchaseConfig.messages.notAvailable)
      return false
    }

    player.call('onShowAdminPanel')
  })

  /*
    Ban player
  */

  mp.events.addCommand('ban', (player, target) => {
    if (!api.isPlayerLoggedIn(player)) {
      player.outputChatBox(copchaseConfig.messages.notAuthenticated)
      return false
    }

    if (!api.isPlayerAdmin(player)) {
      player.outputChatBox(copchaseConfig.messages.notAvailable)
      return false
    }

    let newTarget = mp.players.at(target);

    if(!target || isNaN(target)) return player.outputChatBox("!{orange}[SERVER]: /ban [id игрока]");
    if(newTarget === undefined) return player.outputChatBox("!{orange}[SERVER]: !{red}Игрока с таким ID не найдено.")
    newTarget.outputChatBox("!{orange}[SERVER]: !{red}Вы были заблокированы на этом сервере.");
    newTarget.ban('Заблокирован!');
  })

  /*
    Teleport to location
  */

  mp.events.addCommand('to', (player, location) => {
    if (!api.isPlayerLoggedIn(player)) {
      player.outputChatBox(copchaseConfig.messages.notAuthenticated)
      return false
    }

    if (!api.isPlayerAdmin(player)) {
      player.outputChatBox(copchaseConfig.messages.notAvailable)
      return false
    }

    const findLocation = Object.keys(copchaseConfig.locations).find(_location => _location === location)

    if (findLocation === undefined) {
      player.outputChatBox('!{orange}[SERVER]: !{red}Локация не найдена')
      return false
    }

    player.position = copchaseConfig.locations[location]
  })

  /*
    Teleport to player
  */

  mp.events.addCommand('tp', (player, target) => {
    if (!api.isPlayerLoggedIn(player)) {
      player.outputChatBox(copchaseConfig.messages.notAuthenticated)
      return false
    }

    if (!api.isPlayerAdmin(player)) {
      player.outputChatBox(copchaseConfig.messages.notAvailable)
      return false
    }

    let newTarget = mp.players.at(target);

    if(!target || isNaN(target)) return player.outputChatBox("!{orange}[SERVER]: !{white}/tp [id игрока]");
    if(newTarget === undefined) return player.outputChatBox("!{orange}[SERVER]: !{red}Игрока с таким ID не найдено.")

    player.position = newTarget.position
  })

  /*
    Teleport to player to admin
  */

  mp.events.addCommand('gethere', (player, target) => {
    if (!api.isPlayerLoggedIn(player)) {
      player.outputChatBox(copchaseConfig.messages.notAuthenticated)
      return false
    }

    if (!api.isPlayerAdmin(player)) {
      player.outputChatBox(copchaseConfig.messages.notAvailable)
      return false
    }

    let newTarget = mp.players.at(target);

    if(!target || isNaN(target)) return player.outputChatBox("!{orange}[SERVER]: !{white}/gethere [id игрока]");
    if(newTarget === undefined) return player.outputChatBox("!{orange}[SERVER]: !{red}Игрока с таким ID не найдено.")

    newTarget.spawn(player.position)
  })

  /*
    Kick player
  */

  mp.events.addCommand('kick', (player, target) => {
    if (!api.isPlayerLoggedIn(player)) {
      player.outputChatBox(copchaseConfig.messages.notAuthenticated)
      return false
    }

    if (!api.isPlayerAdmin(player)) {
      player.outputChatBox(copchaseConfig.messages.notAvailable)
      return false
    }

    let newTarget = mp.players.at(target);
    if(!target || isNaN(target)) return player.outputChatBox("!{orange}[SERVER]: !{white}/kick [id игрока]");
    if (newTarget === undefined) return player.outputChatBox("!{orange}[SERVER]: !{red}Игрока с таким ID не найдено.")
    
    mp.players.forEach(_player => _player.outputChatBox(`!{orange}[SERVER]: !{white}Игрок !{1CD8FD}${newTarget.name} !{white}был кикнут с сервера`))
    newTarget.notify('Вы были кикнуты с сервера')
    setTimeout(() => newTarget.kick('Кикнут.'), 300)
  });

  /*
    Get position
    !auth
  */

  mp.events.addCommand('pos', player => {
    if (!api.isPlayerLoggedIn(player)) {
      player.outputChatBox(copchaseConfig.messages.notAuthenticated)
      return false
    }
    
    if (!api.isPlayerAdmin(player)) {
      player.outputChatBox(copchaseConfig.messages.notAvailable)
      return false
    }

    player.outputChatBox(`Pos: ${player.position}`)
  })

  /*
    Create car on Spawn
  */

  mp.events.addCommand('car', (player, carRef) => {
    if (!api.isPlayerLoggedIn(player)) {
      player.outputChatBox(copchaseConfig.messages.notAuthenticated)
      return false
    }
    
    if (!api.isPlayerAdmin(player)) {
      player.outputChatBox(copchaseConfig.messages.notAvailable)
      return false
    }

    if (carRef === undefined) {
      player.outputChatBox('!{orange}[SERVER]: !{white}/car [reference машины]')
      return false
    }

    const car = mp.vehicles.new(mp.joaat(carRef), player.position)

    car.setColor(0, 0, 0)
    car.numberPlate = 'ADMIN'
    car.dimension = player.dimension

    setTimeout(() => player.putIntoVehicle(car, 0), 200)
  })

  mp.events.addCommand('carHealth', (player, string, health) => {
    if(player.vehicle) {
        if(!string) {
            return player.outputChatBox("!{orange}[SERVER]: !{white}/carHealth [value]");
        }      
        player.eval(`mp.players.local.vehicle.setEngineHealth(${health})`)
    } else {
        return player.outputChatBox("!{orange}[SERVER]: !{red}Вы должны находться в машине!");
    }
});

  /*
    Kill player by id
  */

  mp.events.addCommand('kill', (player, target) => {
    if (!api.isPlayerLoggedIn(player)) {
      player.outputChatBox(copchaseConfig.messages.notAuthenticated)
      return false
    }
    
    if (!api.isPlayerAdmin(player)) {
      player.outputChatBox(copchaseConfig.messages.notAvailable)
      return false
    }

    let newTarget = mp.players.at(target);
    if(!target || isNaN(target)) return player.outputChatBox("/kill [id игрока]");
    if (newTarget === undefined) {
      return player.outputChatBox("!{red}Игрока с таким ID не найдено.")
    }
    
    newTarget.health = 0
    newTarget.outputChatBox(`!{orange}Вы были убиты администратором: !{gold}${player.name}`)
  })

  mp.events.addCommand('weather', (player, weather) => {

    if (!api.isPlayerLoggedIn(player)) {
      player.outputChatBox(copchaseConfig.messages.notAuthenticated)
      return false
    }

    if (!api.isPlayerAdmin(player)) {
      player.outputChatBox(copchaseConfig.messages.notAvailable)
      return false
    }

    if (weather === undefined) return player.outputChatBox(`!{orange}[SERVER]: !{white}/weather [name]`)

    mp.world.weather = weather.toLowerCase()
  })
}