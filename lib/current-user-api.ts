import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export const currentProfilePages = async (req: NextApiRequest , res : NextApiResponse) => {
  try {
    const session = await auth(req , res )

    if (!session?.user) {
      return null; 
    }


    const userId = session.user.id;

    const profile = await db.user.findUnique({
      where: { id : userId },
    });

    return profile;
  } catch (error) {
    console.error("Error retrieving profile:", error);
    return null; 
  }
};