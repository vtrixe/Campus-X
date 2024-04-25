import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from 'socket.io'
import { Server, Member, User} from "@prisma/client"
import { NextResponse } from "next/server";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { user: User })[];
};

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
      server: NetServer & {
        io: SocketIOServer;
      };
    };
  };