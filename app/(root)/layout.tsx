import SidebarWrapper from "@components/shared/sidebar/SidebarWrapper";
import { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return <SidebarWrapper>{children}</SidebarWrapper>;
};

export default Layout;
