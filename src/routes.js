import { Navigate, useNavigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Blog from './pages/Blog';
import User from './pages/User';
import NotFound from './pages/Page404';
import { useState,useEffect  } from 'react';

// ----------------------------------------------------------------------

export default function Router() {
  const navigate = useNavigate();
  const usernameLogin = localStorage.getItem('username');
  useEffect(() => {
    if(!usernameLogin){
      navigate("/login", { replace: true });
    }else{
      navigate("/dashboard", { replace: true });
    }
    
  },[usernameLogin]);
  
  return useRoutes([
    {
      path: '/dashboard',
      element:<DashboardLayout />,
      children: [
       
        { path: 'app', element: <User /> },
        { path: 'comic', element: <User /> },
        // { path: 'app', element: <User /> },
        // { path: 'products', element: <Products /> },
        // { path: 'blog', element: <Blog /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
         { path: '/', element:  <Login />},
        { path: 'login', element: <Login /> },
        // { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        // { path: '*', element: <Navigate to="/404" /> }
      ]
    },
     { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
