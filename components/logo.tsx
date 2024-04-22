/* eslint-disable no-unused-vars */
import Link from "next/link";
import Image from "next/image";
import { Noto_Serif_Georgian } from "next/font/google";

import { cn } from "@/lib/utils";

const headingFont = Noto_Serif_Georgian({ subsets: ["latin"] });

export const Logo = () => {
  return (
    <Link href="/">
      <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
        <Image
          src="/reshot.svg"
          alt="Logo"
          height={30}
          width={30}
        />
     <p className="text-lg font-semibold">
            Collaborator
          </p>
     
      </div>
    </Link>
  );
};