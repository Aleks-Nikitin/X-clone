import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../AuthContext";
import profile_pic from "../assets/profile_default.png";

type ReplyModalProps = {
  post: any;
  onClose: () => void;
  onSuccess?: () => void;
};

function ReplyModal({ post, onClose, onSuccess }: ReplyModalProps) {
  const { authFetch, user } = useAuth();
  const picture = user ? user.picture : "";
  const [reply, setReply] = useState("");

  async function onSubmit(e: any) {
    e.preventDefault();
    if (!reply.trim()) return;
    try {
      const response = await authFetch(
        `${import.meta.env.VITE_BACKEND}/comments/${post.id}`,
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
      console.log("comment created");
      setReply("");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[5vh] px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[600px] bg-black border border-gray-800 rounded-2xl overflow-hidden text-white text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3">
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pb-2 flex gap-3">
          <div className="flex flex-col items-center">
            <img src={post.user.picture || profile_pic} className="w-10 h-10 rounded-full" />
            <div className="w-0.5 flex-1 bg-gray-700 my-1 min-h-8" />
          </div>
          <div className="flex-1 min-w-0 pb-2">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="font-bold truncate">{post.user?.fullName}</span>
              <span className="text-gray-500 truncate">@{post.user?.username}</span>
            </div>
            <p className="mt-1 whitespace-pre-wrap wrap-break-word text-[15px]">
              {post.text}
            </p>
            <p className="mt-3 text-gray-500 text-[15px]">
              Replying to{" "}
              <span className="text-sky-500">@{post.user?.username}</span>
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="px-4 pb-4">
          <div className="flex gap-3">
            <img src={picture||profile_pic} className="w-10 h-10 rounded-full shrink-0" />
            <div className="flex-1 min-w-0">
              <textarea
                autoFocus
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Post your reply"
                rows={4}
                className="w-full bg-transparent text-xl placeholder-gray-500 outline-none resize-none"
              />
            </div>
          </div>
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
  );
}

export default ReplyModal;
