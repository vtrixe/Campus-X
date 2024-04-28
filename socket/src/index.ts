
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';




const server = http.createServer();





const io = new SocketIOServer(server, {
  path: '/socket/io',
  addTrailingSlash: false,
  cors: {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'], // Allow all HTTP methods
  },
  
});

io.on('connection', (socket: Socket) => {
  console.log('A user connected');

  socket.on('event', (data) => {
    console.log('Received data:', data);
  
  });

  socket.on("event:message", async ({ message }: { message: string }) => {
    console.log("New Message Rec.", message);


  });



  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
