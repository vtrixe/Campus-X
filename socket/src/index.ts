import { Server as HttpServer } from 'http';
import { Server as IoServer } from 'socket.io';

const httpServer = new HttpServer();
const PORT = process.env.PORT || 8000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = new IoServer(httpServer, {
  path: '/socket.io',
  addTrailingSlash: false,
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  // Add event handlers for different socket events here
  socket.on('message', (data) => {
    console.log('Received message:', data);
    // Broadcast the message to all connected clients
    io.emit('message', data);
  });
});