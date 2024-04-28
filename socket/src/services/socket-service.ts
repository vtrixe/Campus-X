import { Server } from "socket.io";
import http from "http";

class SocketService {
  private _io: Server;

  constructor(httpServer: http.Server, path: string) {
    console.log("Init Socket Service...");

    this._io = new Server(httpServer, {
      path,
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
      pingTimeout: 60000, // 1 minute
      pingInterval: 25000, // 25 seconds
    });
  }

  public initListeners() {
    const io = this.io;

    console.log("Init Socket Listeners...");

    io.on("connect", (socket) => {

        console.log(`New Socket Connected`, socket.id);

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
      
        socket.on("event:message", async ({ message }: { message: string }) => {
          console.log("New Message Rec.", message);
        });
      
        // Add this console log statement
        console.log("Socket connected successfully");
      });
  }

  get io() {
    return this._io;
  }

}

export default SocketService;