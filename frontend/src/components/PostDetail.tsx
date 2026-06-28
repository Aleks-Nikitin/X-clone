import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { ArrowLeft, MessageCircle, Heart } from "lucide-react";
import { useAuth } from "../AuthContext";
import profile_pic from "../assets/profile_default.png";

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

function PostDetail() {
  const { postId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { authFetch } = useAuth();

  const post = location.state?.post;
  const [comments, setComments] = useState<any[]>([]);
  const [reply, setReply] = useState("");

  async function loadComments() {
    try {
      const response = await authFetch(
        `${import.meta.env.VITE_BACKEND}/comments/${postId}`,
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setComments(data.comments ? data.comments : []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadComments();
  }, [postId, authFetch]);

  async function onSubmit(e: any) {
    e.preventDefault();
    if (!reply.trim()) return;
    try {
      const response = await authFetch(
        `${import.meta.env.VITE_BACKEND}/comments/${postId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ text: reply }),
        }
      );
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (!data) {
        throw new Error("comment creation failed");
      }
      setReply("");
      await loadComments();
    } catch (error) {
      console.error(error);
    }
  }

  const { user, _count } = post;

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
        <h1 className="text-xl font-bold">Post</h1>
      </header>

      <article className="p-4 text-left border-b border-gray-800">
        <div className="flex gap-3">
          <img src={profile_pic} className="w-10 h-10 rounded-full shrink-0" />
          <div className="min-w-0">
            <p className="font-bold truncate">{user?.fullName}</p>
            <p className="text-gray-500 truncate">@{user?.username}</p>
          </div>
        </div>
        <p className="mt-3 text-2xl whitespace-pre-wrap wrap-break-word">
          {post.text}
        </p>
        <p className="mt-3 text-gray-500 text-sm">
          {formatPrismaDate(post.createdAt)}
        </p>
        <div className="flex justify-start gap-5 mt-3 pt-3 border-t border-gray-800 text-gray-500">
          <span className="flex items-center gap-1">
            <MessageCircle size={18} />
            <span className="text-xs">{comments.length || _count?.comments || 0}</span>
          </span>
          <span className="flex items-center gap-1">
            <Heart size={18} />
            <span className="text-xs">{_count?.likes || 0}</span>
          </span>
        </div>
      </article>

      <div className="border-b border-gray-800 p-4 flex gap-3">
        <img src={profile_pic} className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-gray-500 text-sm mb-1">
            Replying to <span className="text-sky-500">@{user?.username}</span>
          </p>
          <form onSubmit={onSubmit}>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Post your reply"
              rows={3}
              className="w-full bg-transparent text-xl placeholder-gray-500 outline-none resize-none text-left"
            />
            <div className="flex justify-end pt-3 border-t border-gray-800 mt-2">
              <button
                type="submit"
                disabled={!reply.trim()}
                className="bg-sky-500 text-white font-bold px-4 py-1.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer hover:bg-sky-600"
              >
                Reply
              </button>
            </div>
          </form>
        </div>
      </div>

      <div>
        {comments.length === 0 && (
          <p className="p-4 text-gray-500 text-left">No replies yet.</p>
        )}
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="border-b border-gray-800 p-4 flex gap-3 text-left"
          >
            <img src={profile_pic} className="w-10 h-10 rounded-full shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 flex-wrap">
                <span className="font-bold truncate">
                  {comment.user?.fullName || "User"}
                </span>
                <span className="text-gray-500 truncate">
                  @{comment.user?.username || "user"}
                </span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500">
                  {formatPrismaDate(comment.createdAt)}
                </span>
              </div>
              <p className="mt-1 whitespace-pre-wrap wrap-break-word">
                {comment.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostDetail;
