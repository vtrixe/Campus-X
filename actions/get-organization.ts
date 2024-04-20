"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { RegisterOrganizationSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";

export const getrOrganization = async (
 
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" }
  }

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
  });

 

  if (!dbUser) {
    return { error: "Unauthorized" }
  }


  const profile = await db.profile.findUnique({
    where: { userId: user.id },
  
  });


  const organization = await db.organization.findMany({
    where: {
        profile: {
            some: {
                userId: user.id,
                role: {
                    in: ['OWNER', 'ADMIN'],
                },
            },
        },
    },
    include: {
        profile: true, 
    },
});




 return organization;



};
