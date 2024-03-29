import Navbar from "@/components/ui/Navbar";

const AuthLayout = ({ 
    children
  }: { 
    children: React.ReactNode
  }) => {
    return ( 
        <div className="flex flex-col h-screen">

        {/* Navbar sticks to the top */}
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>
      
        {/* Content area for children, flex-grow allows this div to take up the remaining height */}
        <div className="flex-grow flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
          {children}
        </div>
      
      </div>
      

     );
  }
   
  export default AuthLayout;