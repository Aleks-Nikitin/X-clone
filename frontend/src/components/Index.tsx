import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import RightSidebar from "./RightSidebar";
import type { ChatUser } from "./Chat";

function Index() {
  const location = useLocation();
  const isChatPage = location.pathname === "/chat";
  const [activeChats, setActiveChats] = useState<ChatUser[]>([]);

  return (
    <div className="flex w-full justify-center">
      <div className={`w-full min-w-0 border-r border-gray-800 ${isChatPage ? "max-w-[950px]" : "max-w-[600px]"}`}>
        <Outlet context={{ activeChats, setActiveChats }} />
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
