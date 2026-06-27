import { Link,useNavigate } from "react-router"
import { useAuth } from "../AuthContext.tsx"
import xPic from "../assets/twitter.png"
function Navbar() {
    const {logout,user} = useAuth();
     const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }
    return (
          <header>
            
            <div className="flex flex-col text-white items-baseline">
                <Link to={"/"}><img src={xPic} alt="" width={"50px"}/></Link>
                 <button className="hover:cursor-pointer hover:font-bold" onClick={handleLogout}>
            <h2>log out</h2>
          </button>
          <div className="rounded-xl border text-white p-2"> 
            <h2>{user?.fullName}</h2>
            <h3 className="text-gray-300 text-xs">@{user?.username}</h3>
          </div>
            </div>
          </header>
    )
}
export default Navbar