import { useState } from "react";
import {
  Image,
  Smile,
  Calendar,
  MapPin,
  MessageCircle,
  Repeat2,
  Heart,
  BarChart2,
  Bookmark,
  Share,
} from "lucide-react";
import { useAuth } from "../AuthContext";

const FEED = [
  {
    id: 1,
    name: "Elon Musk",
    handle: "elonmusk",
    time: "2h",
    content: "Mars needs memes.",
    replies: 1240,
    reposts: 3892,
    likes: 42100,
  },
  {
    id: 2,
    name: "The Verge",
    handle: "verge",
    time: "4h",
    content:
      "Apple's latest event packed more AI features into the iPhone than anyone expected. Here's everything announced in under 3 minutes.",
    replies: 89,
    reposts: 412,
    likes: 2800,
  },
  {
    id: 3,
    name: "Sarah Chen",
    handle: "sarahcodes",
    time: "5h",
    content:
      "Spent the weekend rebuilding my side project with React 19. The compiler actually makes a difference. Ship it 🚀",
    replies: 34,
    reposts: 18,
    likes: 892,
  },
  {
    id: 4,
    name: "NASA",
    handle: "NASA",
    time: "8h",
    content:
      "Webb telescope captured this stunning view of a distant galaxy cluster. The universe is wild.",
    replies: 567,
    reposts: 8900,
    likes: 67000,
  },
  {
    id: 5,
    name: "Dev Community",
    handle: "ThePracticalDev",
    time: "12h",
    content:
      "Hot take: the best code review comment is \"LGTM\" followed by actually reading the diff.",
    replies: 201,
    reposts: 890,
    likes: 5400,
  },
];

function formatCount(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function Avatar({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold shrink-0">
      {initial}
    </div>
  );
}

function Content() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"foryou" | "following">("foryou");
  const [draft, setDraft] = useState("");

  return (
    <div className="text-white min-h-screen">
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-gray-800">
        <h1 className="text-xl font-bold px-4 py-3 text-left">Home</h1>
        <div className="flex">
          <button
            type="button"
            onClick={() => setActiveTab("foryou")}
            className={`flex-1 py-4 text-sm font-medium hover:bg-white/10 transition-colors relative ${
              activeTab === "foryou" ? "font-bold" : "text-gray-500"
            }`}
          >
            For you
            {activeTab === "foryou" && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-sky-500 rounded-full" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("following")}
            className={`flex-1 py-4 text-sm font-medium hover:bg-white/10 transition-colors relative ${
              activeTab === "following" ? "font-bold" : "text-gray-500"
            }`}
          >
            Following
            {activeTab === "following" && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-sky-500 rounded-full" />
            )}
          </button>
        </div>
      </header>

      <div className="border-b border-gray-800 p-4 flex gap-3">
        <Avatar name={user?.fullName || "You"} />
        <div className="flex-1 min-w-0">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="What is happening?!"
            rows={3}
            className="w-full bg-transparent text-xl placeholder-gray-500 outline-none resize-none text-left"
          />
          <div className="flex items-center justify-between pt-3 border-t border-gray-800 mt-2">
            <div className="flex gap-1 text-sky-500">
              <button type="button" className="p-2 rounded-full hover:bg-sky-500/10">
                <Image size={20} />
              </button>
              <button type="button" className="p-2 rounded-full hover:bg-sky-500/10">
                <Smile size={20} />
              </button>
              <button type="button" className="p-2 rounded-full hover:bg-sky-500/10">
                <Calendar size={20} />
              </button>
              <button type="button" className="p-2 rounded-full hover:bg-sky-500/10">
                <MapPin size={20} />
              </button>
            </div>
            <button
              type="button"
              disabled={!draft.trim()}
              className="bg-sky-500 text-white font-bold px-4 py-1.5 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sky-600"
            >
              Post
            </button>
          </div>
        </div>
      </div>

      <div>
        {FEED.map((post) => (
          <article
            key={post.id}
            className="border-b border-gray-800 p-4 flex gap-3 hover:bg-white/[0.03] cursor-pointer transition-colors text-left"
          >
            <Avatar name={post.name} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 flex-wrap">
                <span className="font-bold truncate">{post.name}</span>
                <span className="text-gray-500 truncate">@{post.handle}</span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500">{post.time}</span>
              </div>
              <p className="mt-1 whitespace-pre-wrap break-words">{post.content}</p>
              <div className="flex justify-between mt-3 max-w-md text-gray-500">
                <button type="button" className="flex items-center gap-1 hover:text-sky-500 group">
                  <span className="p-2 rounded-full group-hover:bg-sky-500/10">
                    <MessageCircle size={18} />
                  </span>
                  <span className="text-xs">{formatCount(post.replies)}</span>
                </button>
                <button type="button" className="flex items-center gap-1 hover:text-green-500 group">
                  <span className="p-2 rounded-full group-hover:bg-green-500/10">
                    <Repeat2 size={18} />
                  </span>
                  <span className="text-xs">{formatCount(post.reposts)}</span>
                </button>
                <button type="button" className="flex items-center gap-1 hover:text-pink-500 group">
                  <span className="p-2 rounded-full group-hover:bg-pink-500/10">
                    <Heart size={18} />
                  </span>
                  <span className="text-xs">{formatCount(post.likes)}</span>
                </button>
                <button type="button" className="flex items-center gap-1 hover:text-sky-500 group">
                  <span className="p-2 rounded-full group-hover:bg-sky-500/10">
                    <BarChart2 size={18} />
                  </span>
                </button>
                <div className="flex gap-0">
                  <button type="button" className="p-2 rounded-full hover:bg-sky-500/10 hover:text-sky-500">
                    <Bookmark size={18} />
                  </button>
                  <button type="button" className="p-2 rounded-full hover:bg-sky-500/10 hover:text-sky-500">
                    <Share size={18} />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Content;
