
const server = require('../app');
const io = require('socket.io')(server);

const messageController = (req, res) => {
	io.on('connection', (socket) => {
		console.log(`A user connected ${socket.id}`);
		socket.on('sendmessage', (data)=>{
			socket.to(data.recipientSocketID).emit('recievemessage',{text:data.text, time: data.time, isDelivered: true, isSent: true});
		})
	});
};

module.exports = {
	messageController
};
