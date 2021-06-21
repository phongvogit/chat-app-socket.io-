const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMassage } = require('./utils/messages')


const app = express()
const server = http.createServer(app) // Create server outside express library
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let count = 0

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.emit('message', generateMassage('Welcome!'))
    socket.broadcast.emit('message', 'A new user has joined!') // sent to everybody except current user

    socket.on('sendMessage', (text, callback) => {
        
        const filter = new Filter()
        
        if(filter.isProfane(text)){
            return callback('The profane is not allowed')
        }

        io.emit('message', generateMassage(text))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', `https://google.com/maps?q=${coords['latitude']},${coords['longitude']}`)

        callback('Location shared!')
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})