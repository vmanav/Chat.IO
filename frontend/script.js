// UNDERMAINTENANCE ALERT
alert("Chat.IO is under maintenance.")

// Dummy Code to Stop the Functioning on my App
const { cryptr } = require('./cipher.js');
console.log(cryptr)


// console.log("Frontend running")

let socket = io()

socket.on('connected', () => {
    console.log("Socket ID :", socket.id)
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
        // console.log("CLICK HUA BHAI")

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
            alert("Why send an empty Message ?")
            return
        }

        var key = user;
        var plainM = chatInput.val();
        var cipherM = CryptoJS.AES.encrypt(plainM, key);


        socket.emit('send_chat', {
            username: user,
            message: cipherM.toString()
        })
        chatInput.val("")
    })

    socket.on('recieve_chat', (data) => {

        var key = data.username;
        var cipherM = data.message;

        var bytes = CryptoJS.AES.decrypt(cipherM, key)
        var plainM = bytes.toString(CryptoJS.enc.Utf8);


        msgList.prepend(`<li class="list-group-item">${data.username}:${plainM}</li>`)

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
