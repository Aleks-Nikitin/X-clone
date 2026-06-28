import { Link,useNavigate } from "react-router"
import { useAuth } from "../AuthContext.tsx"
import { House,Search,UserPlus,MessageCircle,UserRound} from 'lucide-react';
import xPic from "../assets/twitter.png"
function Navbar() {
    const {logout,user} = useAuth();
     const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }
    return (
          <header className="p-4">
            
            <div className="flex flex-col text-white items-baseline text-xl gap-2.5">
                <Link to={"/"}><img src={xPic} alt="" width={"50px"} className="transition-transform duration-200 hover:scale-110"/></Link>
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
        
                
                 <button className="hover:cursor-pointer hover:font-bold" onClick={handleLogout}>
            <h2>log out</h2>
          </button>
          <div className="rounded-xl  text-white p-2"> 
            <h2>{user?.fullName}</h2>
            <h3 className="text-gray-300 text-xs">@{user?.username}</h3>
          </div>
            </div>
          </header>
    )
}
export default Navbar