import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../AuthContext";
import profile_pic from "../assets/profile_default.png";

type PostComposerModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function PostComposerModal({ isOpen, onClose }: PostComposerModalProps) {
  const { authFetch, user: currentUser } = useAuth();
  const picture = currentUser ? currentUser.picture : "";
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (isOpen) {
      setDraft("");
    }
  }, [isOpen]);

  async function onSubmit(e: any) {
    e.preventDefault();
    if (!draft.trim()) return;
    try {
      const response = await authFetch(`${import.meta.env.VITE_BACKEND}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ text: draft }),
      });
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (!data) {
        throw new Error("post creation failed");
      }
      setDraft("");
      window.dispatchEvent(new Event("post-created"));
      onClose();
    } catch (error) {
      console.error(error);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-24 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[600px] bg-black border border-gray-800 rounded-2xl overflow-hidden text-white text-left shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3 border-b border-gray-800">
          <h2 className="text-lg font-bold">Create post</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="border-b border-gray-800 p-4 flex gap-3">
          <img src={picture || profile_pic} className="w-10 h-10 rounded-full" />
          <div className="flex-1 min-w-0">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="What is happening?!"
              rows={5}
              className="w-full bg-transparent text-xl placeholder-gray-500 outline-none resize-none text-left"
              autoFocus
            />
            <div className="flex items-center justify-end pt-3 border-t border-gray-800 mt-2">
              <form onSubmit={onSubmit}>
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="bg-sky-500 text-white font-bold px-4 py-1.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer hover:bg-sky-600"
                >
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostComposerModal;