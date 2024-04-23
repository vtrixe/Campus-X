import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";

import { Server, Member, User} from "@prisma/client"

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { user: User })[];
};

