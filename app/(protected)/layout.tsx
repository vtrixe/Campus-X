import { Suspense } from "react";
import { Navbar } from "./_components/navbar";


interface ProtectedLayoutProps {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return ( 
    <div className="h-full w-full flex flex-col gap-y-10 items-center justify-cente">
      <Navbar />

  <div className="flex h-full pt-20">

       
   
         {children}

      </div>
    </div>
   );
}

export default ProtectedLayout;