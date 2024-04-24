import { Suspense } from "react";
import { Sidebar } from "./_components/Sidebar";
import { Container } from "./_components/container";

interface ProtectedLayoutProps {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="">
 
      {children}
      </div>
  );
};

export default ProtectedLayout;