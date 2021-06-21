const generateMassage = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (url) => {
    return {
        url, 
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMassage,
    generateLocationMessage
}