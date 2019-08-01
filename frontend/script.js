console.log("Frontend running")

let socket = io()

socket.on('connected', () => {
    console.log("-->", socket.id)
    // socket.emit('xyz')
})

$(function () {
    let user;
    let loginDiv = $('#loginDiv')
    let chatDiv = $('#chatDiv')

    let loginInput = $('#loginInput')
    let loginButton = $('#loginButton')

    let chatInput = $('#chatInput')
    let chatButton = $('#chatButton')
    let msgList = $('#msgList')

    loginButton.click(() => {
        loginDiv.hide()
        chatDiv.show()

        user = loginInput.val()

        socket.emit('login', {
            user: user
        })
    })

    chatButton.click(() => {
        socket.emit('send_chat', {
            username: user,
            message: chatInput.val()
        })
        chatInput.val("")
    })

    socket.on('recieve_chat', (data) => {
        msgList.append(`<li>${data.username}:${data.message}</li>`)
    })

})
