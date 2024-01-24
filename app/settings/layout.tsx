import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import Navbar from "@/components/ui/Navbar";


const SettingsLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <div className="h-full">
    
    <div className="sticky top-0 z-50">
        <Navbar />
    </div>

 
  
    <main className="h-full dark:text-gray-100 text-gray-900">
        {children}
    </main>

   
</div>

  
   );
}
 
export default SettingsLayout;