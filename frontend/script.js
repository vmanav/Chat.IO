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

    let clearChat = $('#clearChat')

    loginButton.click(() => {

        if (loginInput.val() == "") {
            alert("Username can't be empty.")
            return
        }

        loginDiv.removeClass("d-flex").addClass("d-none");

        // loginDiv.hide("fast", () => {
        //     console.log("hide hogya lagta h")
        //     chatDiv.show("slow")
        //     // chatDiv.fadeIn("fast")

        // })
        chatDiv.show("fast")
        // chatDiv.show()
        // loginDiv.fadeOut("fast")


        // chatDiv.css("margin-top", "0px")
        // chatDiv.css("transition","2s")
        // alert("hhihih")
        // chatDiv.fadeIn("slow")
        user = loginInput.val()

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
        console.log("Chat Cleared!")
    })

})
