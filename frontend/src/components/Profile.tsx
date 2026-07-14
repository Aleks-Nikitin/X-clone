import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, MessageCircle, Heart } from "lucide-react";
import { useAuth } from "../AuthContext";
import profile_pic from "../assets/profile_default.png";
import ReplyModal from "./ReplyModal";

function formatPrismaDate(dateString: string) {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: me, authFetch } = useAuth();

  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [replyPost, setReplyPost] = useState<any>(null);

  const isOwnProfile = me?.id === Number(userId);

  async function loadProfile() {
    try {
      const response = await authFetch(
        `${import.meta.env.VITE_BACKEND}/users/${userId}`,
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setProfile(data.user);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadPosts() {
    try {
      const response = await authFetch(
        `${import.meta.env.VITE_BACKEND}/posts/${userId}`,
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setPosts(data.posts ? data.posts : []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadProfile();
    loadPosts();
  }, [userId, authFetch]);

  async function toggleFollow() {
    try {
      const response = await authFetch(
        `${import.meta.env.VITE_BACKEND}/users/${userId}/follow`,
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setProfile((prev: any) => ({
        ...prev,
        isFollowing: data.isFollowing,
        _count: {
          ...prev._count,
          followers: data.isFollowing
            ? prev._count.followers + 1
            : Math.max(0, prev._count.followers - 1),
        },
      }));
    } catch (error) {
      console.error(error);
    }
  }

  if (!profile) {
    return (
      <div className="text-white min-h-screen p-4">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
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
        <div className="text-left">
          <h1 className="text-xl font-bold leading-tight">{profile.fullName}</h1>
          <p className="text-xs text-gray-500">{posts.length} posts</p>
        </div>
      </header>

      <div className="h-48 bg-gray-800" />

      <div className="px-4 text-left">
        <div className="flex justify-between items-end -mt-16 mb-3">
          <img
            src={profile.picture || profile_pic}
            className="w-32 h-32 rounded-full border-4 border-black bg-gray-700 object-cover"
          />
          {!isOwnProfile && (
            <button
              type="button"
              onClick={toggleFollow}
              className={
                profile.isFollowing
                  ? "border border-gray-500 font-bold px-4 py-1.5 rounded-full hover:bg-red-500/10 hover:text-red-500 hover:border-red-500 cursor-pointer"
                  : "bg-white text-black font-bold px-4 py-1.5 rounded-full hover:bg-gray-200 cursor-pointer"
              }
            >
              {profile.isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>

        <h2 className="text-xl font-bold">{profile.fullName}</h2>
        <p className="text-gray-500">@{profile.username}</p>

        <div className="flex gap-4 mt-3 text-sm">
          <span>
            <span className="font-bold">{profile._count ? profile._count.following : 0}</span>{" "}
            <span className="text-gray-500">Following</span>
          </span>
          <span>
            <span className="font-bold">{profile._count ? profile._count.followers : 0}</span>{" "}
            <span className="text-gray-500">Followers</span>
          </span>
        </div>
      </div>

      <div className="mt-4 border-b border-gray-800">
        <div className="px-4 py-3 font-bold relative w-fit">
          Posts
          <span className="absolute bottom-0 left-0 right-0 h-1 bg-sky-500 rounded-full" />
        </div>
      </div>

      <div>
        {posts.length === 0 && (
          <p className="p-4 text-gray-500 text-left">No posts yet.</p>
        )}
        {posts.map((post) => {
          const { user, _count } = post;
          return (
            <article
              key={post.id}
              onClick={() => navigate(`/post/${post.id}`, { state: { post } })}
              className="border-b border-gray-800 p-4 flex gap-3 hover:bg-white/3 cursor-pointer transition-colors text-left"
            >
              <img src={profile_pic} className="w-10 h-10 rounded-full" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="font-bold truncate">{user.fullName}</span>
                  <span className="text-gray-500 truncate">@{user.username}</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-500">
                    {formatPrismaDate(post.createdAt)}
                  </span>
                </div>
                <p className="mt-1 whitespace-pre-wrap wrap-break-word">{post.text}</p>
                <div className="flex justify-start gap-5 mt-3 max-w-md text-gray-500">
                  <button
                    type="button"
                    className="flex items-center gap-1 hover:text-sky-500 group"
                    onClick={(e) => {
                      e.stopPropagation();
                      setReplyPost(post);
                    }}
                  >
                    <span className="p-2 rounded-full group-hover:bg-sky-500/10">
                      <MessageCircle size={18} />
                    </span>
                    <span className="text-xs">{_count ? _count.comments : 0}</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1 hover:text-pink-500 group"
                  >
                    <span className="p-2 rounded-full group-hover:bg-pink-500/10">
                      <Heart size={18} />
                    </span>
                    <span className="text-xs">{_count ? _count.likes : 0}</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {replyPost && (
        <ReplyModal
          post={replyPost}
          onClose={() => setReplyPost(null)}
          onSuccess={loadPosts}
        />
      )}
    </div>
  );
}

export default Profile;
