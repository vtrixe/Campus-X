import { auth } from "@/auth";
import { currentUser } from "@/lib/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { db } from "@/lib/db";
 
const f = createUploadthing();
 
const handleAuth = async () => {
  const user =await currentUser();

  if(!user){
    return { userId : null};
  }
  const userId=user.id
  if (!userId) throw new Error("Unauthorized");
  return { userId: userId };
}

export const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  messageFile: f(["image", "pdf","video"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {})
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;