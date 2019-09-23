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

// `favicon.ico` is in the `public` folder
app.use(express.static('public'))

//middleware for favicon 
app.use(favicon(__dirname + '/public/favicon.ico'))


// Get the `keys` for a particular `value`
function getKeyByValue(object, value) {
    for (var prop in object) {
        if (object.hasOwnProperty(prop)) {
            if (object[prop] === value) {
                return prop;
            }
        }
    }
}


io.on('connection', (socket) => {
    console.log("Connection Established :", socket.id)

    // console.log("Type of socket.id -->", typeof(socket.id)) <= string
    // When the connection is made succesfully
    socket.emit('connected')

    socket.on('login', (data) => {
        usersockets[data.user] = socket.id
        // console.log(typeof (usersockets));   console.log(usersockets)

        socket.broadcast.emit('alertAll', {
            name: data.user,
            incoming: true
        })
    })

    socket.on("send_chat", (data) => {

        if (data.recipient == null) {
            // RCP is NULL, NORMAL MSSG
            io.emit("recieve_chat", {
                message: data.message,
                username: data.username,
                private: false
            })

        }
        else {
            // RCP is not NULL, PVT MSG
            let rcpSocket = usersockets[data.recipient]

            //  when no user exists for private mssg
            if (typeof (rcpSocket) == "undefined") {

                console.log("No such user Found")
                io.to(usersockets[data.username]).emit("recieve_chat", {
                    recipient: data.recipient
                })
                return;
            }

            // PRIVATE MSSG
            io.to(rcpSocket).emit("recieve_chat", {
                message: data.message,
                username: data.username,
                private: true
            })
        }
    })



    socket.on('disconnect', (reason) => {
        let username = null;
        console.log('user disconnected, socketID : ', socket.id);

        username = getKeyByValue(usersockets, socket.id);

        if (username) {
            socket.broadcast.emit('alertAll', {
                name: username,
                incoming: false
            })
        }
    });

})

server.listen(PORT, () => {
    console.log("Server started on http://localhost:4848")
})
