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
        msgList.prepend(`<li>${data.username}:${data.message}</li>`)
        // $("#msgList :first-child").css("color","green")
        $("#msgList :first-child").css({"color":"green", "transform":"scaleY(1.3)","background-color":"lightgreen"})
        setTimeout(()=>{
            $("#msgList :first-child").css({"color":"inherit", "transform":"scaleY(1)", "background-color":"transparent"})
        },300)
    })

})
