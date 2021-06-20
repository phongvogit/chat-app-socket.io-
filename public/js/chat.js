
const socket = io()


document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault()

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message)
})

document.querySelector('#send-location').addEventListener('click', (e) => {
    if(!navigator.geolocation){
        return alert('Geolocation is not supported your browser!')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords['latitude'],
            longitude: position.coords['longitude']
        })
    }) // Note*: _ Cannot transfer position object directly to socket server. 
        //       _ Need to create new object and add needed properties inside
})

socket.on('message', (text) => {
    console.log(text)
})

// socket.on('countUpdated', (count) => {
//     console.log('The count has been updated!', count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     socket.emit('increment')
// })