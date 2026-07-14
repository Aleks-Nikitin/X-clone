import { MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import profile_pic from "../assets/profile_default.png";
import { useAuth } from "../AuthContext";
type SuggestedUser = {
  id: number;
  username: string;
  fullName: string;
  picture?: string;
};

function RightSidebar() {
  const navigate = useNavigate();
  const { authFetch } = useAuth();
  const [users, setUsers] = useState<SuggestedUser[]>([]);
  const [followedIds, setFollowedIds] = useState<number[]>([]);

  
  async function loadSuggestions() {
    try {
      const response = await authFetch(
        `${import.meta.env.VITE_BACKEND}/users/suggestions`,
        { method: "GET" }
      );
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
      const data = await response.json();
      setUsers(data.users ? data.users.slice(0,5) : []);
    } catch (error) {
      console.error(error);
    }
  }
    useEffect(() => {
    loadSuggestions();
  }, [authFetch]);
      async function toggleFollow(targetUserId: number) {
    try {
      const response = await authFetch(
        `${import.meta.env.VITE_BACKEND}/users/${targetUserId}/follow`,
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (data.isFollowing) {
        setFollowedIds((prev) => [...prev, targetUserId]);
        setTimeout(() => {
          setUsers((prev) => prev.filter((user) => user.id !== targetUserId));
        }, 650);
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="sticky top-0 py-2 space-y-4 text-white">


      <section className="bg-gray-900 rounded-2xl overflow-hidden">
           <div>
        {users.length === 0 && (
          <p className="p-4 text-gray-500 text-left">No suggestions right now.</p>
        )}
  <h2 className="text-xl font-bold px-4 py-3 text-left">Who to follow</h2>
        {users.map((user) => {
          const isFollowed = followedIds.includes(user.id);
          return (
            <div
              key={user.id}
              onClick={() => navigate(`/profile/${user.id}`)}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition-all duration-500 text-left ${
                isFollowed ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
              }`}
            >
              <img
                src={user.picture ? user.picture : profile_pic}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold truncate hover:underline">
                      {user.fullName}
                    </p>
                    <p className="text-gray-500 truncate">@{user.username}</p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFollow(user.id);
                    }}
                    className={
                      isFollowed
                        ? "border border-gray-500 text-white font-bold px-4 py-1.5 rounded-full cursor-pointer shrink-0 transition-colors"
                        : "bg-white text-black font-bold px-4 py-1.5 rounded-full hover:bg-gray-200 cursor-pointer shrink-0 transition-colors"
                    }
                  >
                    {isFollowed ? "Following" : "Follow"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
          


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
