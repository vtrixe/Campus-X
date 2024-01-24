import { currentUser  } from "@/lib/auth"
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

export const currentProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirect('/auth/login');
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id
    }
  });


    return profile;
  

};