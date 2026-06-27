import { Link } from "react-router"
import xPic from "../assets/twitter.png"
function Navbar() {
    return (
          <header>
            
            <div className="flex flex-col text-white items-baseline">
                <Link to={"/"}><img src={xPic} alt="" width={"50px"}/></Link>
                <Link to={"/login"}>Login</Link>
              
            </div>
          </header>
    )
}
export default Navbar