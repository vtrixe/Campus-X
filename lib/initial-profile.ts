import { currentUser } from "@/lib/auth"
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirect("/auth/login")
  }

  const profile = await db.user.findUnique({
    where: {
      id : user.id
    }
  });

  if (profile) {
    return profile;
  }

  const newProfile = await db.user.create({
    data: {
      id : user.id,
      name: `${user.name}`,
      image : user.image,
      email : user.email
    }
  });

  return newProfile;
};
