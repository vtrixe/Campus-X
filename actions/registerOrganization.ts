"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { RegisterOrganizationSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";

export const registerOrganization = async (
  values: z.infer<typeof RegisterOrganizationSchema>
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" }
  }

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
  });

  const validatedFields = RegisterOrganizationSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { domain, password, name  ,image } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  if (!dbUser) {
    return { error: "Unauthorized" }
  }

  const existingOrganization = await db.organization.findUnique({
    where: { organizationDomain: domain }
  });

  if (existingOrganization) {
    return { error: "Organization with this domain already exists" };
  }

  // Create the new organization
  const newOrganization = await db.organization.create({
    data: {
      name: name,
      organizationDomain: domain,
      password: hashedPassword,
      image : image,
    },
  });

  const profileUpdate = await db.profile.update({
    where: { userId: user.id },
    data: {

      organization: {
        connect: { id: newOrganization.id },
      },
      role: 'OWNER', 
    },
  });

  if (!profileUpdate) {
    return { error: "Failed to link profile to the organization" };
  }

  return { success: "Organization created and linked successfully" };
};
