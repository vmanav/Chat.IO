const { cryptr } = require('./cipher.js')
console.log(cryptr)

console.log("Frontend running")

let socket = io()

socket.on('connected', () => {
    console.log("-->", socket.id)
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

    let clearChat = $('#clearChat')

    loginButton.click(() => {


        console.log("CLICK HUA BHAI")

        if (loginInput.val() == "") {
            alert("Username can't be empty.")
            return
        }

        loginDiv.removeClass("d-flex").addClass("d-none");
        chatDiv.show("fast")

        // loginDiv.fadeOut("fast")
        user = loginInput.val()

        // displaying the user info at top
        msgList.prepend(`<li class="list-group-item list-group-item-dark font-weight-bold font-italic">User : ${user}</li>`)

        socket.emit('login', {
            user: user
        })
    })

    chatButton.click(() => {

        // sending empty messages
        if (chatInput.val() == "") {
            alert("Message can't be body empty!")
            return
        }

        socket.emit('send_chat', {
            username: user,
            message: chatInput.val()
        })
        chatInput.val("")
    })

    socket.on('recieve_chat', (data) => {
        msgList.prepend(`<li class="list-group-item">${data.username}:${data.message}</li>`)

        // scrolling to the bottom of chat div
        var objDiv = document.getElementById("chatDiv");
        objDiv.scrollTop = objDiv.scrollHeight;

        // $("#msgList :first-child").css({ "transform": "scaleY(1.025)", })
        $("#msgList :first-child").addClass("list-group-item-warning text-monospace font-weight-bold");
        setTimeout(() => {
            $("#msgList :first-child").removeClass("list-group-item-warning text-monospace font-weight-bold");
            // $("#msgList :first-child").css({ "transform": "scaleY(1)", })
        }, 300)

    })

    clearChat.click(() => {
        msgList.html("")
        msgList.prepend(`<li class="list-group-item list-group-item-dark font-weight-bold font-italic">User : ${user}</li>`)
        console.log("Chat Cleared!")
    })

})
