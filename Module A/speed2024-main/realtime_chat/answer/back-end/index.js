const port = 8080;
const express = require('express');
const http = require('http');
const cors = require("cors");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
    }
});
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: false}));

/** Socket **/
const connectedClients = {};
io.on('connection', socket => {
    connectedClients[socket.id] = socket;
    socket.emit("successConnect", socket.id);

    socket.on("submitMessage", function(writer_id, message){
        for(const user_id of Object.keys(connectedClients)) {
            connectedClients[user_id].emit("receiveMessage", {
                user_id: writer_id,
                content: message,
            });
        }
    })
});

server.listen(port, () => {
    console.log('Server is running on http://localhost:' + port);
});