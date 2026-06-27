import { Link } from "react-router"
import xPic from "../assets/twitter.png"
function Navbar() {
    return (
          <header>
            <img src={xPic} alt="" width={"50px"}/>
            <div className="flex flex-col text-white items-baseline">
                <Link to={"/login"}>Login</Link>
                <Link to={"/"}>Index page</Link>
            </div>
          </header>
    )
}
export default Navbar