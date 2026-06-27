import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter,RouterProvider } from 'react-router'
import { AuthProvider } from './AuthContext.tsx'
import './index.css'
import Login from './components/Login.tsx'
import App from './App.tsx'
import Index from './components/Index.tsx'

const router =createBrowserRouter([
  {
    path:"/",
    element: <App></App>,
    children:[
      {
        index:true,
        element: <Index></Index>
      },
      {
        path:"/login",
        element: <Login></Login>
      },
    ]
  }
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AuthProvider>
        <RouterProvider router={router}></RouterProvider>
      </AuthProvider>
  </StrictMode>,
)
