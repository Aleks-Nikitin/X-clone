import { useState } from 'react'
import { Outlet } from 'react-router'
import { useAuth } from './AuthContext.tsx'
import Navbar from './components/Navbar.tsx'
import Login from './components/Login.tsx';
import PostComposerModal from './components/PostComposerModal.tsx'
function App() {
const { user,isLoading } = useAuth();
const [isPostComposerOpen, setIsPostComposerOpen] = useState(false);
if(!user || isLoading){
return(
  <Login></Login>
)
}else{
  return (
    <div className='flex min-h-screen text-left'>
    <Navbar onPostClick={() => setIsPostComposerOpen(true)}></Navbar>
      <main className="flex-1 min-w-0">
        <Outlet/>
      </main>
      <PostComposerModal
        isOpen={isPostComposerOpen}
        onClose={() => setIsPostComposerOpen(false)}
      />
    </div>
  )}
}

export default App
