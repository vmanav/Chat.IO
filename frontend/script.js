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

        if (loginInput.val() == "") {
            alert("Username can't be empty.")
            return
        }

        loginDiv.removeClass("d-flex").addClass("d-none");
        chatDiv.show("fast")

        user = loginInput.val()

        // Displaying the username at top
        msgList.prepend(`<li class="list-group-item list-group-item-dark font-weight-bold font-italic">User : ${user}</li>`)

        socket.emit('login', {
            user: user
        })

        // User Enter/ Leave notifications
        socket.on('alertAll', (data) => {
            // console.log("Data is -->", data);

            // Some User Joins chat
            if (data.incoming == true) {
                new Noty({
                    type: 'success',
                    layout: 'bottomRight',
                    theme: 'metroui',
                    text: `${data.name} joined the chat.`,
                    timeout: '2500',
                    progressBar: true,
                    closeWith: ['click'],
                    killer: false,
                    animation: {
                        open: 'animated bounceInRight', // Animate.css class names
                        close: 'animated pulse'
                    }

                }).show();
            }

            // Some User Leaves chat
            else {
                new Noty({
                    type: 'error',
                    layout: 'bottomLeft',
                    theme: 'metroui',
                    text: `${data.name} has left the chat.`,
                    timeout: '2000',
                    progressBar: true,
                    closeWith: ['click'],
                    killer: false,
                    animation: {
                        open: 'animated bounceInLeft', 
                        close: 'animated fadeOut' 
                    }

                }).show();
            }
        })

    })


    //Clicking on SEND button
    chatButton.click(() => {
        recipient = null;

        if (chatInput.val() == "") {
            // EMPTY MSSG BODY
            alert("Why send an empty Message ?")
            return
        }

        // ENCRYPTION
        var key = user;
        var plainM = chatInput.val();

        if (plainM.startsWith('@')) {
            var recipient = plainM.split(':')[0].substr(1);
            plainM = plainM.split(':')[1]
        }
        var cipherM = CryptoJS.AES.encrypt(plainM, key);

        socket.emit('send_chat', {
            username: user,
            message: cipherM.toString(),
            recipient: recipient
        })

        chatInput.val("")
    })


    socket.on('recieve_chat', (data) => {
        // console.log("Recieved Data --->");console.log(data.username);console.log(data.message);console.log(data.private)

        // recipient field is present in `data`
        if (data.recipient) {
            alert(`Error while sending to ${data.recipient}, No Such User Found!`)
            new Noty({
                type: 'info',
                layout: 'centerLeft',
                theme: 'metroui',
                text: `Follow: @username: Your Message.`,
                timeout: '1500',
                progressBar: true,
                closeWith: ['click'],
                killer: false,
                animation: {
                    open: 'animated pulse', 
                    close: 'animated fadeOut' 
                }

            }).show();
            return;
        }

        // DECRYPTION ----
        var key = data.username;
        var cipherM = data.message;

        var bytes = CryptoJS.AES.decrypt(cipherM, key)
        var plainM = bytes.toString(CryptoJS.enc.Utf8);


        // PRIVATE MSSG
        if (data.private == true) {
            // plainM = `<b>[ <i>PRIVATE</i> ]</b>` + plainM
            plainM = `&nbsp;<i class="fa fa-user-secret" style="color:#C1292E"></i>&nbsp;` + plainM
        }
        else {
            plainM = `&nbsp;` + plainM;
        }

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
