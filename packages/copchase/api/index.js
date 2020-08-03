const copchaseConfig = require('../copchase-config')

class API {
  constructor(players) {
    this.players = players
    this.authenticatedPlayers = []
    this.blips = {}
  }

  authenticatedPlayers() {
    return this.authenticatedPlayers
  }

  addAuthPlayer(player) {
    this.authenticatedPlayers.push({
      id: player.id,
      name: player.name
    })
  }

  delAuthPlayer(player) {
    const index = this.authenticatedPlayers.findIndex(_player => _player.name === player.name)
    
    if (index != -1) this.authenticatedPlayers.splice(index, 1)
  }

  isPlayerLoggedIn(player) {
    if (this.authenticatedPlayers.find(_player => _player.name === player.name)) {
      return true
    } else {
      return false
    }
  }

  isPlayerAdmin(candidate) {
    if (copchaseConfig.admins.find(admin => candidate.name === admin.name)) {
      return true
    } else {
      return false
    }
  }
}

module.exports = API