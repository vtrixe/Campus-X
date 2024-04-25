import { Suspense } from "react";
import { Sidebar, SidebarSkeleton } from "./_components/Sidebar";
import { Container } from "./_components/container";

interface ProtectedLayoutProps {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <>
   
   <div className="h-full">

      <main className=" h-full">
        {children}
      </main>
    </div>

  </>
  );
};

export default ProtectedLayout;