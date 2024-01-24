import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";


const MainLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <div className="h-full dark:bg-gray-800 bg-white">
    <div className="hidden md:flex h-full w-18 z-30 flex-col fixed top-0 left-0 dark:bg-gray-900 bg-gray-100  border-r dark:border-gray-700">
      <NavigationSidebar />
    </div>
    <main className="md:pl-18 h-full dark:text-gray-100 text-gray-900 ">
      {children}
    </main>
    <div className="md:hidden fixed bottom-0 left-0 w-full h-20">
    <NavigationSidebar />
  </div>
  </div>
  
  
   );
}
 
export default MainLayout;