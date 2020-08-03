const bcrypt = require('bcryptjs')
const { Player } = require('../../models/index')
const copchaseConfig = require('../../copchase-config')

module.exports = ({ api, copchase }) => {

  /* 
    Show Online
    !auth
  */

  mp.events.addCommand('online', player => {
    if (!api.isPlayerLoggedIn(player)) {
      player.outputChatBox(copchaseConfig.messages.notAuthenticated)
      return false
    }

    player.outputChatBox(`!{orange}[SERVER]: !{white}Онлайн сейчас: !{1CD8FD}${mp.players.length}`)
  })

  /* 
    Register Player
    !auth
  */

  mp.events.addCommand('reg', (player, message) => {
    const candidate = api.players.filter(_player => _player.name === player.name)

    if (candidate.length > 0) {
      player.outputChatBox(copchaseConfig.messages.accountRegistered)
      return false
    }
 
    if (api.isPlayerLoggedIn(player)) {
      player.outputChatBox(copchaseConfig.messages.authenticated)
      return false
    }

    if (message === undefined) {
      player.outputChatBox('!{orange}[SERVER]: !{red}Введите пароль для регистрации')
      return false
    }

    const passwords = message.split(' ')

    if (passwords[0] === passwords[1]) {
      try {
        if (candidate.length <= 0) {
  
          player.outputChatBox('!{orange}[SERVER]: !{white}Регистируем аккаунт...')
          const newPlayer = new Player({
            name: player.name,
            password: bcrypt.hashSync(message.split(' ')[0], bcrypt.genSaltSync(10))
          })

          newPlayer.save().then((data) => api.players.push(data))

          player.notify('~g~Аккаунт зарегистрирован!')
          player.outputChatBox(`!{orange}[SERVER]: !{white}/login [пароль] !{green}для авторизации.`)
          console.log(`Игрок с ником ${player.name} зарегистрировался!`)
        } else {
          player.notify('~r~Вы уже зарегистрированы!')
        }
      } catch (error) {
        player.notify('~r~Произошла ошибка!')
      }
    } else {
      player.notify('~r~Пароли не совпадают!')
    }
  })

  /* 
    Login Player
    !auth
  */

  mp.events.addCommand('login', (player, message) => {
    if (api.isPlayerLoggedIn(player)) {
      player.outputChatBox(copchaseConfig.messages.authenticated)
      return false
    }

    const candidatePassword = message
    const currentPlayer = api.players.filter(currentPlayer => currentPlayer.name === player.name)

    if (currentPlayer.length <= 0) {
      player.notify('~r~Вы еще не зарегистрировали аккаунт!')
      return false
    }
  
    if (message === undefined) {
      player.notify('~r~Введите пароль!')
      return false
    }
    
    bcrypt.compare(candidatePassword, currentPlayer[0].password, function(err, res) {
      if (err){
        player.notify('~r~Произошла ошибка при авторизации!')
      }
  
      if (res) {
        player.notify('~g~Вы авторизовались!')
        player.call('login', [player]) // выключить фриз
  
        api.addAuthPlayer(player)
        console.log(api.authenticatedPlayers)
      } else {
        player.notify('~r~Неверный пароль!')
      }
    })
  })

  /* 
    Spawn
    !auth
  */

  mp.events.addCommand('spawn', player => {
    if (!api.isPlayerLoggedIn(player)) {
      player.outputChatBox(copchaseConfig.messages.notAuthenticated)
      return false
    }

    if (copchase.isPlayerInWaitingRoom(player)) return false
    if (copchase.isPlayerInGame(player)) return false

    player.dimension = 0
    player.position = copchaseConfig.spawn
  })

  mp.events.addCommand('copchase', player => {
    if (!api.isPlayerLoggedIn(player)) {
      player.outputChatBox(copchaseConfig.messages.notAuthenticated)
      return false
    }

    if (copchase.isPlayerInWaitingRoom(player)) return false
    if (copchase.isPlayerInGame(player)) return false

    player.dimension = copchase.waitingRoomDimension
    player.position = copchaseConfig.waitingRoom

    copchase.addPlayerToWaitingRoom(player) // добавить игрока в комнату ожидания
    player.call('setInv', [player])

    if (copchase.isStarted && copchase.players.length > 0) {
      return player.outputChatBox('!{orange}[SERVER]: !{blue}Игра уже начата! Ожидание игроков...')
    }

    if (copchase.waitingPlayers.length < copchase.minPlayers) {
      return player.outputChatBox('!{orange}[SERVER]: !{blue}Ожидание игроков...')
    }

    copchase.startGame()

  })
}


