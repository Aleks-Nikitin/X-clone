import { Outlet } from 'react-router'
import Navbar from './components/Navbar.tsx'
function App() {

  return (
    <>
    <Navbar></Navbar>
      <main>
        <Outlet/>
      </main>
    </>
  )
}

export default App
