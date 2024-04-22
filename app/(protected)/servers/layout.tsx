import { Suspense } from "react";
import { Sidebar } from "./_components/Sidebar";
import { Container } from "./_components/container";

interface ProtectedLayoutProps {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return ( 
    <div className="h-full w-full flex flex-col gap-y-10 items-center justify-cente">


          <Sidebar />
  
        <Container>
         {children}
        </Container>

    </div>
   );
}

export default ProtectedLayout;