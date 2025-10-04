import { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface PageLayoutProps {
  role: "ngo" | "admin";
  children: ReactNode;
}

const PageLayout = ({ role, children }: PageLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar role={role} />
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
