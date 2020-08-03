const mongoose = require('mongoose')
const { Player } = require('./models')
const API = require('./api')
const Copchase = require('./copchase')

const startServer = async () => {

  try {
    await mongoose.connect('mongodb+srv://sergeyyarkov:1234@cluster0.erqpg.mongodb.net/copchase-db?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })

    console.log('Database connected!') 

    const players = await Player.find({})
    const api = new API(players)
    const copchase = new Copchase({ 
      dimension: 10, 
      waitingRoomDimension: 5, 
      maxPlayers: 11, 
      minPlayers: 1, 
      timeRemaining: 10, 
      timeToStart: 3
    })
    
    /* 
      Commands
    */

    require('./commands/admin/admin')({ api })
    require('./commands/player/player')({ api, copchase })

    /* 
      Events
    */

    require('./events/admin/admin')({ api })
    require('./events/player/player')({ api, copchase })

  } catch (error) {
    console.log('Error!', error) 
  }
}

startServer()