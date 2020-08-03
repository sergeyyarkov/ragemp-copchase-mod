const copchaseConfig = require('./copchase-config')

class Copchase {
  constructor({ dimension, waitingRoomDimension, minPlayers, maxPlayers, timeRemaining, timeToStart }) {
    this.dimension = dimension
    this.waitingRoomDimension = waitingRoomDimension
    this.minPlayers = minPlayers
    this.maxPlayers = maxPlayers
    this.timeRemaining = timeRemaining
    this.timeRemainingInterval = null
    this.timeToStart = timeToStart
    this.isStarted = false
    this.suspectCars = [
      'asea',
      'bison',
      'bobcatxl',
      'burrito',
      'emperor',
      'emperor2',
      'ardent',
      'ingot',
      'journey',
      'clique',
      'vamos',
      'tulip',
      'stafford',
      'cheburek',
      'streiter',
      'nebula',
      'hellion',
      'gauntlet4'
    ]
    this.weather = [
      'EXTRASUNNY',
      'CLEAR',
      'CLOUDS',
      'SMOG',
      'FOGGY',
      'OVERCAST',
      'RAIN',
      'THUNDER',
      'CLEARING',
      'NEUTRAL',
      'SNOW',
      'BLIZZARD',
      'SNOWLIGHT',
      'XMAS',
      'HALLOWEEN'
    ]
    this.players = []
    this.waitingPlayers = []
    this.cars = []
    this.blips = {}
    this.suspect = null
    this.positions = {
      suspect: [
        { x: 395.185, y: -999.645, z: 28.755 },
        { x: 404.691, y: -1907.0604, z: 24.723 },
        { x: 2619.436, y: 3374.145, z: 55.619 }
      ],
      police: [
        { x: 442.308, y: -1025.066, z: 28.231 },
        { x: 348.865, y: -1966.507, z:24.133 },
        { x: 2678.454, y: 3459.637, z: 55.340 }
      ]
    }
  }

  pushWaitingPlayersToGame(waitingPlayers) {
    waitingPlayers.forEach(_player => this.players.push(_player))
    this.waitingPlayers = []
  }

  messageToWaitingPlayers(message) {
    this.waitingPlayers.forEach(_player => _player.outputChatBox(message))
  }

  messageToPlayersInGame(message) {
    this.players.forEach(_player => _player.outputChatBox(message))
  }

  notifyPolicePlayers(message) {
    this.players.forEach(_player => _player.name !== this.suspect.name ? _player.notify(message) : false)
  }

  notifySuspectPlayer(message) {
    this.suspect.notify(message)
  }

  addPlayerToWaitingRoom(player) {
    this.waitingPlayers.push(player)
  }

  setDefaultState() {
    this.timeRemainingInterval = null
    this.isStarted = false
    this.suspect = null
    this.players = []
    this.waitingPlayers = []
    this.blips = {}

    setTimeout(() => {
      this.cars.forEach(car => car.destroy())
      this.cars = []
    }, 3000)
  }

  isPlayerInGame(player) {
    if(this.players.find(_player => _player.name === player.name) !== undefined) {
      player.outputChatBox('!{orange}[COPCHASE]: !{red}Дождитесь окончания игры!')
      return true
    } else {
      return false
    }
  }

  isPlayerInWaitingRoom(player) {
    if(this.waitingPlayers.find(_player => _player.name === player.name) !== undefined) {
      player.outputChatBox('!{orange}[COPCHASE]: !{red}Вы уже в комнате ожидания!')
      return true
    } else {
      return false
    }
  }

  selectSuspect() {
    this.suspect = this.players[Math.floor(Math.random() * (this.players.length - 1 - 0 + 1) + 0)]
  }
  
  startGame() {
    let timeToStart = this.timeToStart
    const interval = setInterval(() => {
      timeToStart = timeToStart - 1

      if (timeToStart <= 0) {
        this.isStarted = true

        this.pushWaitingPlayersToGame(this.waitingPlayers)
        this.selectSuspect()

        this.messageToPlayersInGame(`!{orange}[COPCHASE]: !{blue}Игра началась!`)
        this.messageToPlayersInGame(`!{orange}[COPCHASE]: !{white}Саспект: !{red}${this.suspect.name}`)
        this.notifyPolicePlayers(`~w~ Остановите саспекта!`)
        this.notifySuspectPlayer(`~w~ Уйдите от полицейских!`)


        //  spawn cars and players
        this.spawnPlayers().then(() => {
          setTimeout(() => this.spawnCars(), 1000)
        })

        setInterval(() => {
          this.players.forEach((player, id) => {
            if (this.blips[player.id] && player.health > 0) {
              this.blips[player.id].position = player.position;
            }
          })
        }, 1000)

        mp.world.weather = this.weather[Math.floor(Math.random() * (this.weather.length - 1 - 0) + 0)]
        
        let timeRemaining = this.timeRemaining
        this.timeRemainingInterval = setInterval(() => {
          timeRemaining = timeRemaining - 1
          if (timeRemaining !== 0) {
            this.messageToPlayersInGame(`!{orange}[COPCHASE]: !{white}Время до окончания: !{blue}${timeRemaining} !{white}мин.`)
          }

          if (timeRemaining <= 0) {
            this.stopGame('suspect')

            clearInterval(this.timeRemainingInterval)
            return true
          }
        }, 60000)

        clearInterval(interval)
        return true
      }

      this.messageToWaitingPlayers(`!{orange}[COPCHASE]: !{blue}Игра начнется через: !{white}${timeToStart}`)
    }, 1000)
  }

  stopGame(type) {

    clearInterval(this.timeRemainingInterval)

    this.players.forEach(_player => {
      if (this.blips[_player.id]) {
        this.blips[_player.id].destroy();
      }

      setTimeout(() => {
        _player.dimension = 0
        _player.health = 100
        _player.position = copchaseConfig.spawn
        _player.removeAllWeapons()
        _player.call('setInv', [_player])
      }, 3000)
    })

    this.setDefaultState()

    if (type === 'police') {
      mp.players.forEach(_player => {
        _player.outputChatBox(`!{orange}[COPCHASE]: !{blue}Игра закончилась. Полиция выиграла!`)
        _player.outputChatBox(`!{orange}[COPCHASE]: !{white}/copchase !{blue} для повторной игры`)
      })
      
      console.log(`[COPCHASE]: Игра закончилась! Полиция выиграла!`)
    }

    if (type === 'suspect') {
      mp.players.forEach(_player => {
        _player.outputChatBox(`!{orange}[COPCHASE]: !{blue}Игра закончилась. Саспект выиграл!`)
        _player.outputChatBox(`!{orange}[COPCHASE]: !{blue}/copchase !{white} для повторной игры`)
      })

      console.log(`[COPCHASE]: Игра закончилась! Саспект выиграл!`)
    }
  }

  spawnPlayers() {
    let suspectRandomNumber = Math.floor(Math.random() * this.positions.suspect.length)
    let suspectPosition = this.positions.suspect[suspectRandomNumber]

    return new Promise((resolve, reject) => {
      this.players.forEach(_player => {
        if (_player.name === this.suspect.name) {
          _player.position = suspectPosition
          _player.dimension = this.dimension
          _player.model = ped.skin[Math.floor(Math.random() * (435 - 432) + 432)]
          _player.call('delInv', [_player])
          
          this.blips[_player.id] = mp.blips.new(1, suspectPosition)
	        this.blips[_player.id].name = _player.name
	        this.blips[_player.id].dimension = this.dimension
	        this.blips[_player.id].color = 1
        } else {  
          _player.position = {
            x: this.positions.police[suspectRandomNumber].x + 2,
            y: this.positions.police[suspectRandomNumber].y,
            z: this.positions.police[suspectRandomNumber].z
          }
          _player.heading = 260
          _player.dimension = this.dimension
          _player.model = ped.skin[625]
          _player.call('delInv', [_player])
          _player.giveWeapon(mp.joaat('weapon_stungun'), 99999)

          this.blips[_player.id] = mp.blips.new(1, suspectPosition)
	        this.blips[_player.id].name = _player.name
	        this.blips[_player.id].dimension = this.dimension
	        this.blips[_player.id].color = 38
        }
      })

      resolve()
    })
  }

  spawnCars() {
    this.players.forEach(_player => {
      if (_player.name === this.suspect.name) {
        const carSuspect = mp.vehicles.new(mp.joaat(this.suspectCars[Math.floor(Math.random() * (this.suspectCars.length - 1 - 0) + 0)]), _player.position, {
          dimension: this.dimension
        })

        carSuspect.setColor(0, 0, 0)
        carSuspect.numberPlate = 'suspect'
        _player.putIntoVehicle(carSuspect, 0)

        this.cars.push(carSuspect)
      } else {
        const carPolice = mp.vehicles.new(mp.joaat('police3'), _player.position, {
          dimension: this.dimension
        })

        carPolice.setColor(0, 0, 0)
        carPolice.numberPlate = 'police'
        _player.putIntoVehicle(carPolice, 0)

        this.cars.push(carPolice)
      }
    })
  }
}

module.exports = Copchase