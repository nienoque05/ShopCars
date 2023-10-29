import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/layout'
import Home from './pages/Home'
import CarDetail from './pages/Car'

import Dashboard from './pages/Dashboard'
import LogIn from './pages/LogIn'
import Register from './pages/Register'
import { Private } from './Routes/Private'
import New from './pages/Dashboard/New'

const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {
        path: '/home',
        element: <Home/>
      },
      {
      path: '/car/:id',
      element: <CarDetail/>
      },
      {
      path:  '/dashboard/new',
      element: <Private><New/></Private>

      },
      {
        path: '/dashboard',
        element: <Private><Dashboard/></Private>
      }
    ]},
  {
    path: '/',
    element: <LogIn/>
  },
  {path: '/register', element: <Register/>}
])
export {router}