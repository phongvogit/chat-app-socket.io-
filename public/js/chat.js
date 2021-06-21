
const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $buttonLocation = $messageForm.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error){
            console.log(error)
        }

        console.log('Message is delivered')
    })
})

document.querySelector('#send-location').addEventListener('click', (e) => {
    if(!navigator.geolocation){
        return alert('Geolocation is not supported your browser!')
    }

    $buttonLocation.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords['latitude'],
            longitude: position.coords['longitude']
        }, (message) => {
            $buttonLocation.removeAttribute('disabled')
            console.log(message)
        })
    }) 
    // Note*: _ Cannot transfer position object directly to socket server. 
    //        _ Need to create new object and add needed properties inside
})