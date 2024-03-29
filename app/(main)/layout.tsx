import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import Navbar from "@/components/ui/Navbar";


const MainLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <div className="h-full dark:bg-black bg-white">
    
    <div className="sticky top-0 z-50">
        <Navbar />
    </div>

 
    <div className="hidden md:flex h-screen w-18 z-30 flex-col fixed top-[4rem] left-0 dark:bg-red-600 bg-pink-300">
        <NavigationSidebar />
    </div>

    <main className="h-full dark:text-gray-100 text-gray-900">
        {children}
    </main>

    <div className="md:hidden fixed bottom-0 left-0 w-full h-20">
        <NavigationSidebar />
    </div>
</div>

  
   );
}
 
export default MainLayout;