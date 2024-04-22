import { currentUser } from "./auth";
import { db } from "./db";


export const currentProfile = async () => {
    const user = await currentUser();
    const userId = user?.id;


    const profile = await db.user.findUnique({
        where : {
            id : userId
        }
    })

    return profile;
}