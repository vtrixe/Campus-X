import { initialProfile } from "@/lib/initial-profile";

import { db } from "@/lib/db";

import React from 'react'
import { currentRole, currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { InitialModal } from "@/components/dialogs/initial-dialog-admin";


const Setup = async () => {

    const user = await currentUser();
    
const role = await currentRole();


    

    const server = await db.server.findFirst({
        where: {
          members: {
            some: {
                userId : user?.id
            }
          }
        }
      });


      if(server){
        return redirect(`/servers/${server.id}`)
      }
  return (

    <div>

        {role === "ADMIN"  && <InitialModal />}

        {role === "USER" && <p>Join a Server</p>
        
        }
    
    </div>
  )
}

export default Setup;