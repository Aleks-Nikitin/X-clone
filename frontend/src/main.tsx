import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter,RouterProvider } from 'react-router'
import { AuthProvider } from './AuthContext.tsx'
import './index.css'
import Login from './components/Login.tsx'
import App from './App.tsx'
import Index from './components/Index.tsx'
import Content from './components/Content.tsx'
import PostDetail from './components/PostDetail.tsx'
import Profile from './components/Profile.tsx'

const router =createBrowserRouter([
  {
    path:"/",
    element: <App></App>,
    children:[
      {
        element: <Index></Index>,
        children:[
          {
            index:true,
            element: <Content></Content>
          },
          {
            path:"post/:postId",
            element: <PostDetail></PostDetail>
          },
          {
            path:"profile/:userId",
            element: <Profile></Profile>
          },
        ]
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
