const express = require("express");
const cors = require("cors");
const http = require("http");

// constants
const PORT = process.env.PORT || 4000;

// app, server, socket
const app = express();
const server = http.Server(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

// middleware
app.use(cors());

// routes
app.get('/', (req, res) => {
	res.send('Running');
});

// socket
io.on("connection", (socket) => {
	socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
