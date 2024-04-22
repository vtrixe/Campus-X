import { Footer } from "../(landing)/_components/footer";
import { Navbar } from "../(landing)/_components/navbar";
const MarketingLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="h-full bg bg-white dark:bg-black">
      <Navbar />
      <main className="h-full flex flex-col items-center justify-center space-y-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MarketingLayout;