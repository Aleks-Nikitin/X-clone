import Content from "./Content";
import RightSidebar from "./RightSidebar";

function Index() {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-[600px] shrink-0 border-r border-gray-800">
        <Content />
      </div>
      <aside className="hidden xl:block w-[350px] shrink-0 px-4">
        <RightSidebar />
      </aside>
    </div>
  );
}

export default Index;
