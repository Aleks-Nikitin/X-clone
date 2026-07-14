import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../AuthContext";
import profile_pic from "../assets/profile_default.png";

type SuggestedUser = {
  id: number;
  username: string;
  fullName: string;
  picture?: string;
};

function Follow() {
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
      setUsers(data.users ? data.users : []);
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
    <div className="text-white min-h-screen">
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-gray-800 flex items-center gap-6 px-3 py-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-white/10 cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Follow</h1>
      </header>

      <section className="border-b border-gray-800 p-4 text-left">
        <h2 className="text-2xl font-bold">Suggested for you</h2>
        <p className="text-gray-500 text-sm mt-1">
          Follow people to make your timeline more interesting.
        </p>
      </section>

      <div>
        {users.length === 0 && (
          <p className="p-4 text-gray-500 text-left">No suggestions right now.</p>
        )}

        {users.map((user) => {
          const isFollowed = followedIds.includes(user.id);
          return (
            <div
              key={user.id}
              onClick={() => navigate(`/profile/${user.id}`)}
              className={`border-b border-gray-800 p-4 flex gap-3 hover:bg-white/3 cursor-pointer transition-all duration-500 text-left ${
                isFollowed ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
              }`}
            >
              <img
                src={user.picture ? user.picture : profile_pic}
                className="w-12 h-12 rounded-full object-cover"
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
    </div>
  );
}

export default Follow;