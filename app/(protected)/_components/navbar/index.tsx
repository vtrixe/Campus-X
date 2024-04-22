import { Logo } from "./logo";
import { Search } from "./search";
import { Actions } from "./actions";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full h-20 z-[49] bg-white dark:bg-black px-2 lg:px-4 flex justify-between items-center shadow-sm border border-[#2D2E35] ">
      <Logo />
      <Search />
      <Actions />
    </nav>
  );
};
