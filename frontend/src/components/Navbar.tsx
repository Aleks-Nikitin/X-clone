import { useState } from "react"
import { Link,useNavigate } from "react-router"
import { useAuth } from "../AuthContext.tsx"
import { House,UserPlus,MessageCircle,UserRound} from 'lucide-react';
import XLogo from "./XLogo"
import profile_pic from "../assets/profile_default.png";
type NavbarProps = {
  onPostClick: () => void;
}

function Navbar({ onPostClick }: NavbarProps) {
    const {logout,user} = useAuth();
     const navigate = useNavigate();
     const [showUserMenu, setShowUserMenu] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/");
  }
    return (
          <header className="fixed left-0 top-0 z-50 flex flex-col h-screen w-[68px] md:w-[275px] p-2 md:p-4 border-r border-gray-800 bg-black items-center md:items-stretch">
            <div className="flex flex-col text-white items-center md:items-baseline text-xl gap-2.5 flex-1 w-full">
                <Link to={"/"} className="p-2 md:-ml-2 rounded-full hover:bg-white/10 transition-colors"><XLogo size={28} /></Link>
                <Link to={"/"} className="flex items-center gap-1.5 cursor-pointer hover:font-bold transition-transform duration-200 hover:scale-105">
                    <House size={28} strokeWidth={1.25} />
                    <h2 className="hidden md:block">Home</h2>
                </Link>
                    <Link to={"/follow"} className="flex items-center gap-1.5 cursor-pointer hover:font-bold transition-transform duration-200 hover:scale-105">
                               <UserPlus size={28} strokeWidth={1.25} />
                    <h2 className="hidden md:block">Follow</h2>
                </Link>
                <Link to={"/chat"} className="flex items-center gap-1.5 cursor-pointer hover:font-bold transition-transform duration-200 hover:scale-105">
                    <MessageCircle size={28} strokeWidth={1.25} />
                    <h2 className="hidden md:block">Chat</h2>
        
                </Link>  
                   <Link to={`/profile/${user?.id}`} className="flex items-center gap-1.5 cursor-pointer hover:font-bold transition-transform duration-200 hover:scale-105">
                    <UserRound size={28} strokeWidth={1.25} />
                    <h2 className="hidden md:block">Profile</h2>
        
                </Link>  
                 <div className="flex items-center justify-center md:justify-start w-full">
                    
                    <button
                      type="button"
                      onClick={onPostClick}
                      className="bg-white text-black text-[1rem] rounded-full md:rounded-4xl border-0 md:border-8 px-0 md:px-15.5 py-2 cursor-pointer w-12 h-12 md:w-auto md:h-auto flex items-center justify-center"
                    >
                        <span className="md:hidden text-2xl leading-none">+</span>
                        <h2 className="hidden md:block">Post</h2>
                    </button>
        
                </div>  
            </div>
            <div className="relative mt-auto w-full">
              {showUserMenu && (
                <div className="absolute bottom-0 left-full ml-2 md:left-0 md:right-0 md:bottom-full md:ml-0 md:mb-2 z-[60] bg-black border border-gray-700 rounded-xl overflow-hidden shadow-lg min-w-[180px]">
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
                className="rounded-xl text-white p-2 w-full text-left flex gap-0 md:gap-3 justify-center md:justify-start hover:bg-gray-900 transition-colors"
                onClick={() => setShowUserMenu((open) => !open)}
              >
                <img src={user?.picture || profile_pic} alt="" className="w-8 h-8 rounded-full shrink-0"/>
                <div className="hidden md:block min-w-0">
                  <h2 className="truncate">{user?.fullName}</h2>
                  <h3 className="text-gray-300 text-xs truncate">@{user?.username}</h3>
                </div>
              </button>
            </div>
          </header>
    )
}
export default Navbar
