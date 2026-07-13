import { Search, MoreHorizontal } from "lucide-react";
import profile_pic from "../assets/profile_default.png";

function RightSidebar() {
  return (
    <div className="sticky top-0 py-2 space-y-4 text-white">
      <label className="relative block">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-gray-900 border border-transparent focus:border-sky-500 rounded-full py-3 pl-12 pr-4 outline-none placeholder-gray-500 text-sm"
        />
      </label>

      <section className="bg-gray-900 rounded-2xl overflow-hidden">
        <h2 className="text-xl font-bold px-4 py-3 text-left">Who to follow</h2>
          
          <div // render the whole block when it'll be connected to backend
            // later key={user.id}
            className="flex items-center gap-3 px-4 py-3 hover:bg-white/5"
          >
            <img src={profile_pic} className="w-10 h-10 rounded-full"/>
            <div className="flex-1 min-w-0 text-left">
              <p className="font-bold truncate">full name</p>
              <p className="text-gray-500 text-sm truncate">@username</p>
            </div>
            <button
              type="button"
              className="bg-white text-black font-bold text-sm px-4 py-1.5 rounded-full hover:bg-gray-200 shrink-0"
            >
              Follow
            </button>
          </div>

        <button
          type="button"
          className="w-full px-4 py-3 text-left text-sky-500 hover:bg-white/5 text-sm"
        >
          Show more
        </button>
      </section>

      <footer className="px-4 text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-1 text-left">
        <span>Terms of Service</span>
        <span>Privacy Policy</span>
        <span>Cookie Policy</span>
        <span>Accessibility</span>
        <span>More</span>
        <span className="flex items-center gap-1">
          <MoreHorizontal size={14} />
        </span>
        <p className="w-full pt-2">© 2026 X Corp.</p>
      </footer>
    </div>
  );
}

export default RightSidebar;
