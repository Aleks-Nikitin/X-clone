import { Outlet, useLocation } from "react-router";
import RightSidebar from "./RightSidebar";

function Index() {
  const location = useLocation();
  const isChatPage = location.pathname === "/chat";

  return (
    <div className="flex w-full justify-center">
      <div className={`w-full shrink-0 border-r border-gray-800 ${isChatPage ? "max-w-[950px]" : "max-w-[600px]"}`}>
        <Outlet />
      </div>
      {!isChatPage && (
        <aside className="hidden xl:block w-[350px] shrink-0 px-4">
          <RightSidebar />
        </aside>
      )}
    </div>
  );
}

export default Index;
