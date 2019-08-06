const express = require('express')
const socket = require('socket.io')
const http = require('http')    // http is present in node library
const favicon = require('serve-favicon');

// specifying heroku's env.PORT
const PORT = process.env.PORT || 4848;

const app = express()

const server = http.createServer(app)

const io = socket(server)

let usersockets = {}

app.use('/', express.static(__dirname + '/frontend'))

app.use(express.static('public'))
app.use(favicon(__dirname + '/public/favicon.ico'))


// middleware for favicon
// app.use(favicon(__dirname + '/frontend/favicon.ico'))
// app.use(favicon(__dirname + '/frontend/favicon.ico'), ()=>{
//     console.log("->>>",__dirname)
// });

io.on('connection', (socket) => {
    console.log("Connection Established ", socket.id)

    // When the connection is made succesfully
    socket.emit('connected')

    socket.on('login', (data) => {
        usersockets[data.user] = socket.id
        console.log(usersockets)
    })

    socket.on("send_chat", (data) => {

        // private message functionality -->
        if (data.message.startsWith('@')) {
            // suppose, data.message = "@a: hello", we have to get 'a' from it.
            // split at :, then remove '@' from begining
            let recipient = data.message.split(':')[0].substr(1)
            let rcpSocket = usersockets[recipient]


            //whwn no user exists for private mssg
            if (typeof (rcpSocket) == "undefined") {
                console.log("No such user Found")

                io.to(usersockets[data.username]).emit("recieve_chat", {
                    message: ' No Such User Found!',
                    username: 'Error while sending to ' + recipient
                })
                return;
            }

            // user exists case
            io.to(rcpSocket).emit("recieve_chat", {
                message: `<b>[<i>PRIVATE</i>]</b>` + data.message.split(':')[1],
                username: data.username
            })

        }
        else {
            // Normal mssg case    
            io.emit("recieve_chat", {
                message: data.message,
                username: data.username
            })
        }
    })
})

server.listen(PORT, () => {
    console.log("Server started on http://localhost:4848")
})
