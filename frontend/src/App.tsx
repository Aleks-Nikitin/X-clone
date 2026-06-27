import { Outlet } from 'react-router'
import { useAuth } from './AuthContext.tsx'
import Navbar from './components/Navbar.tsx'
import Login from './components/Login.tsx';
function App() {
const { user } = useAuth();
if(!user){
return(
  <Login></Login>
)
}else{
  return (
    <>
    <Navbar></Navbar>
      <main>
        <Outlet/>
      </main>
    </>
  )}
}

export default App
