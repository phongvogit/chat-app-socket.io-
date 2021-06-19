
const socket = io()


document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault()

    const message = e.target.elements.message.value
    
    socket.emit('sendMessage', message)
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