import Link from "next/link";
import { Poppins } from "next/font/google";
import { FaMedal } from "react-icons/fa";
import { Merriweather } from "next/font/google";


import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const headingFont = Merriweather({
  subsets: ['latin', 'cyrillic'],
  weight: "300"
});

const textFont = Poppins({
  subsets: ["latin"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900"
  ],
});

const MarketingPage = () => {
  return (
    <div className="flex items-center justify-center flex-col ">
      <div className={cn(
        "flex items-center justify-center flex-col",
        headingFont,
      )}>
        <div className="mb-4 flex items-center border shadow-sm p-4 bg-amber-100 text-amber-700 rounded-full uppercase">
          <FaMedal className="h-6 w-6 mr-2" />
          Collaboration Platform
        </div>
        <h1 className="text-3xl md:text-6xl text-center text-neutral-800 mb-6">
          Campus-X
        </h1>
        <div className="text-3xl md:text-6xl bg-gradient-to-r from-fuchsia-600 to-pink-600 text-black dark:text-white px-4 p-2 rounded-md pb-4 w-fit">
          Connect , Collaborate , Grow
        </div>
      </div>
      <div className={cn(
        "text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto",
        textFont.className,
      )}>
       Connect and Collaborate, host lectures, Seminars and move forward.
      </div>
      <Button className="mt-6" size="lg" asChild>
        <Link href="/sign-up">
          Get Started For Free
        </Link>
      </Button>
    </div>
  );
};

export default MarketingPage;