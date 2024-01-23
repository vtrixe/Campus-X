import { currentUser  } from "@/lib/auth"
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirect('/auth/login');
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id
    }
  });

  if (profile) {
    return profile;
  }

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.name}`,
      imageUrl: user.image,
      email: user.email
    }
  });

  return newProfile;
};