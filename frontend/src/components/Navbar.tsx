import { useState } from "react"
import { Link,useNavigate } from "react-router"
import { useAuth } from "../AuthContext.tsx"
import { House,Search,UserPlus,MessageCircle,UserRound} from 'lucide-react';
import XLogo from "./XLogo"
function Navbar() {
    const {logout,user} = useAuth();
     const navigate = useNavigate();
     const [showUserMenu, setShowUserMenu] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/");
  }
    return (
          <header className="sticky top-0 self-start flex flex-col h-screen w-[275px] shrink-0 p-4 border-r border-gray-800 overflow-y-auto">
            <div className="flex flex-col text-white items-baseline text-xl gap-2.5 flex-1">
                <Link to={"/"} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"><XLogo size={28} /></Link>
                <div className="flex items-center gap-1.5 cursor-pointer hover:font-bold transition-transform duration-200 hover:scale-105">
                    <House size={40} strokeWidth={1.25} />
                    <h2>Home</h2>
                </div>
                   <div className="flex items-center gap-1.5 cursor-pointer hover:font-bold transition-transform duration-200 hover:scale-105">
                    <Search size={40} strokeWidth={1.25} className=""/>
                    <h2 className="">Explore</h2>
        
                </div>  
                    <div className="flex items-center gap-1.5 cursor-pointer hover:font-bold transition-transform duration-200 hover:scale-105">
                               <UserPlus size={40} strokeWidth={1.25} />
                    <h2>Follow</h2>
                </div>
                <div className="flex items-center gap-1.5 cursor-pointer hover:font-bold transition-transform duration-200 hover:scale-105">
                    <MessageCircle size={40} strokeWidth={1.25} />
                    <h2 className="">Chat</h2>
        
                </div>  
                   <div className="flex items-center gap-1.5 cursor-pointer hover:font-bold transition-transform duration-200 hover:scale-105">
                    <UserRound size={40} strokeWidth={1.25} />
                    <h2 className="">Profile</h2>
        
                </div>  
                 <div className="flex items-center gap-1.5 cursor-pointer hover:font-bold transition-transform duration-200 hover:scale-105">
                    
                    <button className="bg-white text-black text-[1rem] rounded-4xl border-8 px-15.5 py-2 cursor-pointer">
                        <h2 className="">Post</h2>
                    </button>
        
                </div>  
            </div>
            <div className="relative mt-auto w-full">
              {showUserMenu && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-black border border-gray-700 rounded-xl overflow-hidden shadow-lg">
                  <button
                    type="button"
                    className="w-full px-4 py-3 text-left hover:bg-gray-900 text-white text-base"
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                </div>
              )}
              <button
                type="button"
                className="rounded-xl text-white p-2 w-full text-left hover:bg-gray-900 transition-colors"
                onClick={() => setShowUserMenu((open) => !open)}
              >
                <h2>{user?.fullName}</h2>
                <h3 className="text-gray-300 text-xs">@{user?.username}</h3>
              </button>
            </div>
          </header>
    )
}
export default Navbar