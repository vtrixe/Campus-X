import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import cors from 'cors';

const server = http.createServer();
const io = new SocketIOServer(server, {
  path: '/socket/io',
  addTrailingSlash: false,
  cors: {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'], // Allow all HTTP methods
  },
});

io.on('connection', (socket: Socket) => {
  console.log('A user connected');

  // Handle incoming events from the client
  socket.on('event', (data) => {
    console.log('Received data:', data);
    // Perform any necessary actions based on the event and data received
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});