import { ReactNode, useEffect, useState } from "react";
import Navbar from "./navbar";
import SidebarNav from "./sidebarNav";
import MoreInformation from "./moreInformation";
import { userContext } from "@/contexts/userContext";
import useFetch from "@/hooks/useFetch";
type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  const hasAccessToken = localStorage.getItem("accessToken") ? true : false;
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(hasAccessToken);
  const {
    isLoading,
    error,
    responseData: userData,
    fetchData,
  } = useFetch("http://localhost:3000/api/user/profile", "GET");

  useEffect(() => {
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  return (
    <>
      <userContext.Provider
        value={{ isLoggedIn, setIsLoggedIn, userData, isLoading, error }}
      >
        <SidebarNav className="hidden xl:block" />
        <Navbar />
        <main className="grid min-h-screen mx-auto lg:grid-cols-3 xl:grid-cols-xlLayout max-w-[2000px] mt-[4.5rem] gap-4">
          <div className="lg:col-start-1 lg:col-end-3 xl:col-start-2 xl:col-end-3">
            {children}
          </div>
          <aside className="hidden lg:col-start-3 lg:col-end-4 lg:block">
            <MoreInformation />
          </aside>
        </main>
      </userContext.Provider>
    </>
  );
}

export default Layout;
