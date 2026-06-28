import { useEffect, useState } from "react";

import {
  MessageCircle,
  Heart,

} from "lucide-react";
import { useAuth } from "../AuthContext";
import profile_pic from "../assets/profile_default.png";

function Content() {
      const { user, authFetch } = useAuth();
  const [feed,setFeed] = useState([]);
  const [activeTab, setActiveTab] = useState<"foryou" | "following">("foryou");
  const [draft, setDraft] = useState("");
  useEffect(()=>{
      async function generateFeed() {
      try {
        const response= await authFetch(`${import.meta.env.VITE_BACKEND}/posts`,{
            method:"GET",
        })
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if(!data){
            throw new Error("feed creation failed")
        }
       const {posts}=data;
       console.log(posts);
       setFeed(posts);
    } catch (error) {
        console.error(error);
    }
  }
    generateFeed()
  },[authFetch])
 async function onSubmit(e:any) {
    e.preventDefault()
    try {
        const response= await authFetch(`${import.meta.env.VITE_BACKEND}/posts`,{
            method:"POST",
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({text:draft})
        })
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if(!data){
            throw new Error("post creation failed")
        }
       console.log("post created");
       setDraft("");
    } catch (error) {
        console.error(error);
    }


  }

  return (
    <div className="text-white min-h-screen">
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-gray-800">
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
        <img src={profile_pic} className="w-10 h-10 rounded-full"/>
        <div className="flex-1 min-w-0">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="What is happening?!"
            rows={3}
            className="w-full bg-transparent text-xl placeholder-gray-500 outline-none resize-none text-left"
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

      <div>
        {feed.map((post) => {
          const {user} = post;
          const {comments} = post;
          const {_count} =post;
          const formatPrismaDate = (dateString) => {
            if (!dateString) return '';
            
            const dateObj = new Date(dateString);
            
            return new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }).format(dateObj);
          };
          return (
          <article
            key={post.id}
            className="border-b border-gray-800 p-4 flex gap-3 hover:bg-white/3 cursor-pointer transition-colors text-left"
          >
            <img src={profile_pic} className="w-10 h-10 rounded-full"/>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 flex-wrap">
                <span className="font-bold truncate">{user.fullName}</span>
                <span className="text-gray-500 truncate">@{user.username}</span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500">{formatPrismaDate(post.createdAt)}</span>
              </div>
              <p className="mt-1 whitespace-pre-wrap wrap-break-word">{post.text}</p>
              <div className="flex justify-start gap-5 mt-3 max-w-md text-gray-500">
                <button type="button" className="flex items-center gap-1 hover:text-sky-500 group">
                  <span className="p-2 rounded-full group-hover:bg-sky-500/10">
                    <MessageCircle size={18} />
                  </span>
                  <span className="text-xs">{_count.comments}</span>
                </button>
                <button type="button" className="flex items-center gap-1 hover:text-pink-500 group">
                  <span className="p-2 rounded-full group-hover:bg-pink-500/10">
                    <Heart size={18} />
                  </span>
                  <span className="text-xs">{_count.likes}</span>
                </button> 

             </div>
             </div>
           </article>
        )
        })}
      </div>
    </div>
  );
}

export default Content;
