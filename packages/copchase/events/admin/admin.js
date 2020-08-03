const copchaseConfig = require('../../copchase-config')

module.exports = ({ api }) => {
  mp.events.add('[ui:showAdminPanel]', player => {
    if (api.isPlayerLoggedIn(player) && api.isPlayerAdmin(player)) player.call('onShowAdminPanel')
  })
  mp.events.add('[ui:kickPlayer]', (player, targetName) => {
    if (!api.isPlayerLoggedIn(player)) {
      player.outputChatBox(copchaseConfig.messages.notAuthenticated)
      return false
    }

    if (!api.isPlayerAdmin(player)) {
      player.outputChatBox(copchaseConfig.messages.notAvailable)
      return false
    }

    const target = mp.players.toArray().find(_player => _player.name === targetName)

    if (target === undefined) return player.outputChatBox("!{orange}[SERVER]: !{red}Игрока с таким ID не найдено.")

    mp.players.forEach(_player => _player.outputChatBox(`!{orange}[SERVER]: !{white}Игрок !{1CD8FD}${target.name} !{white}был кикнут с сервера`))
    target.notify('Вы были кикнуты с сервера')
    setTimeout(() => target.kick('Кикнут.'), 300)

    player.call('updatePlayers')
  })
  mp.events.add('[ui:banPlayer]', (player, targetName) => {
    if (!api.isPlayerLoggedIn(player)) {
      player.outputChatBox(copchaseConfig.messages.notAuthenticated)
      return false
    }

    if (!api.isPlayerAdmin(player)) {
      player.outputChatBox(copchaseConfig.messages.notAvailable)
      return false
    }

    const target = mp.players.toArray().find(_player => _player.name === targetName)

    if (target === undefined) return player.outputChatBox("!{orange}[SERVER]: !{red}Игрока с таким ID не найдено.")

    mp.players.forEach(_player => _player.outputChatBox(`!{orange}[SERVER]: !{white}Игрок !{1CD8FD}${target.name} !{white}был заблокирован`))
    target.notify('Вы были заблокированы на этом сервере')
    setTimeout(() => target.ban('Заблокирован.'), 300)
  })
  mp.events.add('[ui:killPlayer]', (player, targetName) => {
    if (!api.isPlayerLoggedIn(player)) {
      player.outputChatBox(copchaseConfig.messages.notAuthenticated)
      return false
    }

    if (!api.isPlayerAdmin(player)) {
      player.outputChatBox(copchaseConfig.messages.notAvailable)
      return false
    }

    const target = mp.players.toArray().find(_player => _player.name === targetName)

    if (target === undefined) return player.outputChatBox("!{orange}[SERVER]: !{red}Игрока с таким ID не найдено.")

    target.notify('Вы были убиты администратором сервера')
    target.health = 0
  })
  mp.events.add('[ui:teleportToPlayer]', (player, targetName) => {
    if (!api.isPlayerLoggedIn(player)) {
      player.outputChatBox(copchaseConfig.messages.notAuthenticated)
      return false
    }

    if (!api.isPlayerAdmin(player)) {
      player.outputChatBox(copchaseConfig.messages.notAvailable)
      return false
    }

    const target = mp.players.toArray().find(_player => _player.name === targetName)

    if (target === undefined) return player.outputChatBox("!{orange}[SERVER]: !{red}Игрока с таким ID не найдено.")

    player.notify(`Вы телепортировались к игроку ${target.name}`)
    player.position = target.position
  })
  mp.events.add('[ui:teleportToMe]', (player, targetName) => {
    if (!api.isPlayerLoggedIn(player)) {
      player.outputChatBox(copchaseConfig.messages.notAuthenticated)
      return false
    }

    if (!api.isPlayerAdmin(player)) {
      player.outputChatBox(copchaseConfig.messages.notAvailable)
      return false
    }

    const target = mp.players.toArray().find(_player => _player.name === targetName)

    if (target === undefined) return player.outputChatBox("!{orange}[SERVER]: !{red}Игрока с таким ID не найдено.")

    player.notify(`Игрок ${target.name} был телепортирован к вам`)
    target.notify(`Вы были телепортированы администратором`)

    target.position = player.position
  })
  mp.events.add('[ui:spawnCar]', (player, carRef) => {
    if (api.isPlayerLoggedIn(player) && api.isPlayerAdmin(player)) {
     
      const car = mp.vehicles.new(mp.joaat(carRef), player.position)

      car.setColor(0, 0, 0)
      car.numberPlate = 'ADMIN'
      car.dimension = player.dimension

      setTimeout(() => player.putIntoVehicle(car, 0), 200)
    }
  })

  mp.events.add('[ui:teleportToLocation]', (player, location) => {
    if (api.isPlayerLoggedIn(player) && api.isPlayerAdmin(player)) {
      const findLocation = Object.keys(copchaseConfig.locations).find(_location => _location === location)

      if (findLocation === undefined) {
        player.outputChatBox('!{orange}[SERVER]: !{red}Локация не найдена')
        return false
      }
  
      player.position = copchaseConfig.locations[location]
    }
  })

  mp.events.add('[ui:godMode]', (player, godmode) => {
    if (api.isPlayerLoggedIn(player) && api.isPlayerAdmin(player)) {
      player.call('onGodMode', [player, godmode])
      godmode ? player.notify(`Режим неуязвимости: вкл`) : player.notify(`Режим неуязвимости: выкл`)
    }
  })

  mp.events.add('[ui:getHealth]', player => {
    if (api.isPlayerLoggedIn(player) && api.isPlayerAdmin(player)) {
      player.health = 100
      player.notify(`Ваше здоровье было восстановлено!`)
    }
  })

  mp.events.add('[ui:giveWeapon]', (player, weaponRef) => {
    if (api.isPlayerLoggedIn(player) && api.isPlayerAdmin(player)) {
      if (weaponRef === 'parachute') {
        player.giveWeapon(mp.joaat(`gadget_${weaponRef}`), 99999)
        return false
      }
      
      player.giveWeapon(mp.joaat(`weapon_${weaponRef}`), 99999)
    }
  })
}