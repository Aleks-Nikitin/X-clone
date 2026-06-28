import { Outlet } from 'react-router'
import { useAuth } from './AuthContext.tsx'
import Navbar from './components/Navbar.tsx'
import Login from './components/Login.tsx';
function App() {
const { user,isLoading } = useAuth();
if(!user || isLoading){
return(
  <Login></Login>
)
}else{
  return (
    <div className='flex min-h-screen text-left'>
    <Navbar></Navbar>
      <main className="flex-1 min-w-0">
        <Outlet/>
      </main>
    </div>
  )}
}

export default App
