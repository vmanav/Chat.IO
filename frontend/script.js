console.log("Frontend running")

let socket = io()

socket.on('connected', () => {
    console.log("-->",socket.id)
    // socket.emit('xyz')
})

$(function () {
    // hiding onload
    let user = ""
    $('#sendChat').hide()
    $('#msgList').hide()

    $('#login').click(() => {
        $('#sendChat').show()
        $('#msgList').show()
        $('#login').hide()
        user = $('#inputChat').val()
        $('#inputChat').val("")
        $('#inputChat').attr("placeholder", "Enter message here")
        // console.log("user ->",user)  

        
        // we will emit the user when clixk on 'logn in
        socket.emit('login', {
            user: user
        })

        // hat recieving functionality included here from outside
        let sendChat = $('#sendChat')

        sendChat.click(() => {
            socket.emit('send_chat', {
                message: $('#inputChat').val(),
                username: user
            })
        })

        // -----------------------------------------------------

        // If we want the full history with previous chats then this code is moved below

        // let msgList = $('#msgList')
        // socket.on('recieve_chat', function (data) {
        //     msgList.append(`<li>${data.username}:${data.message}</li>`)
        // })
        // -----------------------------------------------------


    })


    let msgList = $('#msgList')

    socket.on('recieve_chat', function (data) {
        $('#sendChat').val("")
        msgList.append(`<li>${data.username}:${data.message}</li>`)
    })


    // NOTE: 
    // when we want that 'loign' click karne ke bad hi chat portal pe recieve kar sakte ha then,
    // all the socket.on() functionality will go inside this:
    // ' $('#login').click(() => {}'

    // -----------------------------------------------------
    // let sendChat = $('#sendChat')
    // let msgList = $('#msgList')

    // sendChat.click(() => {
    //     socket.emit('send_chat', {
    //         message: $('#inputChat').val(),
    //         username: user
    //     })
    // })

    // socket.on('recieve_chat', function (data) {
    //     msgList.append(`<li>${data.username}:${data.message}</li>`)
    // })
    // -----------------------------------------------------
})
