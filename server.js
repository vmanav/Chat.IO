// NOTE:
// Same functioning like dhruv's code just his is nicely written

const express = require('express')
const socket = require('socket.io')
const http = require('http')
// http is present in node library

const app = express()
const server = http.createServer(app)

const io = socket(server)

let usersockets = {}

app.use('/', express.static(__dirname + '/frontend'))

io.on('connection', (socket) => {
    console.log("Connection Established ", socket.id)

    // When the connection is made succesfully
    socket.emit('connected')

    socket.on('login', (data) => {
        //username of the user is in data.user
        // storing the socket id in 'usersockets'
        usersockets[data.user] = socket.id
        console.log(usersockets)
    })

    socket.on("send_chat", (data) => {

        // Old code  -->
        // ---------------------------------------------------
        // console.log("Data Recieved =>",data.username, " : ", data.message)
        // // emit to eveyone
        // io.emit("recieve_chat", {
        //     message: data.message,
        //     username: data.username
        // })
        // ---------------------------------------------------

        // Adding the private message functionality -->
        if (data.message.startsWith('@')) {
            // suppose, data.message = "@a: hello", we have to get 'a' from it.
            // split at :, then remove '@' from begining
            let recipient = data.message.split(':')[0].substr(1)
            let rcpSocket = usersockets[recipient]
            io.to(rcpSocket).emit("recieve_chat", {
                message: data.message.split(':')[1],
                username: data.username
            })
        }
        else {
            socket.broadcast.emit("recieve_chat", {
                message: data.message,
                username: data.username
            })
        }
    })
})

server.listen(process.env.PORT || 4848, () => {
    console.log("Server started on http://localhost:4848")
})

// HomeWork ->

// MODEL :- chat messages: usernam,mssg
// mapping between username and socketID in backend
// sending to a particuar socketID
