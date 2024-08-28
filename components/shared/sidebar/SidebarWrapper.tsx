import { PropsWithChildren } from "react";
import DesktopNav from "./nav/DesktopNav";
import MobileNav from "./nav/MobileNav";

const SidebarWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-full h-full p-4 flex flex-col lg:flex-row gap-4">
      <DesktopNav />
      <MobileNav />
      <main className="h-[calc(100%-80px)] lg:h-full w-full flex gap-4">{children}</main>
    </div>
  );
};

export default SidebarWrapper;
