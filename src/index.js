const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMassage, generateLocationMessage } = require('./utils/messages')
const {addUser, getUser, removeUser, getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app) // Create server outside express library
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let count = 0

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', (options, callback) => {
        const {error, user} = addUser({id: socket.id, ...options})
        
        if(error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMassage(user.username, 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMassage(user.username,`${user.username} has joined!`)) // sent to everybody except current user and another room

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
    })
    

    socket.on('sendMessage', (text, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()
        
        if(filter.isProfane(text)){
            return callback('The profane is not allowed')
        }

        io.to(user.room).emit('message', generateMassage(user.username, text))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        const url = `https://google.com/maps?q=${coords['latitude']},${coords['longitude']}`
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, url))

        callback('Location shared!')
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user) {
            console.log(user)
            io.to(user.room).emit('message', generateMassage(user.username,`${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})