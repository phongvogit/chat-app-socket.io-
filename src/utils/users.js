const users = []

// addUser, removeUser, getUser, getUserInRoom

const addUser = ({id, username, room}) => {
    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if(!username || !room){
        return {
            error: 'Username and room is required!'
        }
    }

    //Check for existing user
    const existingUser = users.find((user) => user.room === room && user.username === username)

    if(existingUser){
        return {
            error: 'Username is in use'
        }       
    }

    const user = {id, username, room}
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    users[index].id = 23
    console.log(users[index])
    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

addUser({
    id: 22,
    username: 'Phong',
    room: 'Lahti'
})

console.log(users)

const removeUsers = removeUser(22)
console.log(removeUsers)
console.log(users)
