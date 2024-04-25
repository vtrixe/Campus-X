import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { db } from '../database/db';
// Replace with your actual secret key
const JWT_SECRET = 'your-secret-key';

interface SessionUser {
  profileId: string;
  profile: any;
}

interface SocketWithUser extends Socket {
  user: SessionUser;
}

const httpServer = new HttpServer();
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: 'https://your-next-app.vercel.app',
    credentials: true,
  },
});

io.use(async (socket, next) => {
  try {
    const sessionData = socket.handshake.auth.session;
    if (!sessionData) {
      return next(new Error('Unauthorized'));
    }

    const session = jwt.verify(sessionData, JWT_SECRET) as NextAuthSession;
    const { profileId, profile } = session.user as SessionUser;
    (socket as SocketWithUser).user = { profileId, profile };
    next();
  } catch (err) {
    next(new Error('Unauthorized'));
  }
});

interface MessageData {
  content: string;
  fileUrl?: string;
  channelId: string;
  serverId: string;
}

io.on('connection', (socket: SocketWithUser) => {
  console.log('A user connected');

  // Access the profileId and profile information
  const { profileId, profile } = socket.user;

  // Event listeners and handlers for different socket events
  socket.on('message', async ({ content, fileUrl, channelId, serverId }: MessageData) => {
    try {
      // Find the server and channel
      const server = await db.server.findFirst({
        where: {
          id: serverId,
          members: { some: { profileId } },
        },
        include: { members: true },
      });

      if (!server) {
        return socket.emit('error', { message: 'Server not found' });
      }

      const channel = await db.channel.findFirst({
        where: { id: channelId, serverId },
      });

      if (!channel) {
        return socket.emit('error', { message: 'Channel not found' });
      }

      // Find the member
      const member = server.members.find((member) => member.profileId === profileId);

      if (!member) {
        return socket.emit('error', { message: 'Member not found' });
      }

      // Create the message
      const message: Message = await db.message.create({
        data: { content, fileUrl, channelId, memberId: member.id },
        include: { member: { include: { profile: true } } },
      });

      // Emit the message to the channel
      const channelKey = `chat:${channelId}:messages`;
      io.emit(channelKey, message);

      // Emit a success response to the sender
      socket.emit('message_sent', message);
    } catch (error) {
      console.log('[MESSAGE]', error);
      socket.emit('error', { message: 'Internal Error' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server listening on port ${PORT}`);
});