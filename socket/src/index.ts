
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import cors from 'cors';
import Redis from 'ioredis'
import { produceMessage } from './services/kafka';



const server = http.createServer();


  // const pub = new Redis("");
  // console.log("Successfully connected PUb");
  // const sub = new Redis("");


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
  // sub.subscribe("MESSAGES");
  // console.log("Subscribed to Redis channel");
  socket.on('event', (data) => {
    console.log('Received data:', data);
  
  });

  socket.on("event:message", async ({ message }: { message: string }) => {
    console.log("New Message Rec.", message);
    // await pub.publish("MESSAGES", JSON.stringify({ message }));
    // console.log("Message Successfully Published to Redis");

  });

  // sub.on("message", async (channel, message) => {
  //   if (channel === "MESSAGES") {
  //     console.log("new message from redis", message);
  //     // io.emit("message", message);
  //     // await produceMessage(message);
  //     // console.log("Message Produced to Kafka Broker");
  //   }
  // });


  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
