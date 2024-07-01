import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy } from 'react';
import ProtectRoute from './components/auth/ProtectRoute';
import NotFound from './pages/NotFound';
import Title from './components/shared/Title';
import Dashboard from './pages/admin/Dashboard';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { userExists, userNotExists } from './redux/reducers/auth';
import { Toaster } from 'react-hot-toast';


const UserManagement=lazy(()=>import("./pages/admin/UserManagment"))
const MessagesManagement=lazy(()=>import("./pages/admin/MessageManagment"))
const ChatManagement=lazy(()=>import("./pages/admin/ChatManagment"))
const AdminLogin=lazy(()=>import("./pages/admin/AdminLogin"))
const Home=lazy(()=> import("./pages/Home"))
const Groups=lazy(()=> import("./pages/Groups"))
const Chat=lazy(()=> import("./pages/Chat"))
const Login=lazy(()=> import("./pages/Login"))
import { server } from './components/constants/config';
import { SocketProvider } from './socket';

const App = () => {
  const {user,loader}=useSelector((state)=>state.auth);
  // const {loader}=useSelector((state)=>state.auth);
  // const user=false;
   console.log(user)

  const dispatch=useDispatch();

  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch((err) => dispatch(userNotExists()));
  }, [dispatch]);


  return loader? (
    <div>Loading...</div>
  ) : (

    <BrowserRouter>
    <Suspense fallback={<div>Loading...</div>}>
    <Title />
      <Routes>

      
      {/* <Route path="/" element={
      <ProtectRoute user={user}>
         <Home />
      </ProtectRoute>
      } />

      
<Route path="/groups" element={<Groups />} />
      <Route path="/chat/:chatid" element={<Chat />} /> */}



 <Route
            element={
              <SocketProvider>
                <ProtectRoute user={user} />
              </SocketProvider>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/groups" element={<Groups />} />

          </Route>


      




{/* 
      <Route
      path="/admin"
      element={
        <ProtectRoute user={user}>
            <AdminLogin />
        </ProtectRoute>
      }
       />




<Route
      path="/admin/dashboard"
      element={
        <ProtectRoute user={user}>
            <Dashboard />
        </ProtectRoute>
      }
       />

<Route
      path="/admin/messages"
      element={
        <ProtectRoute user={user}>
            <MessageManagement />
        </ProtectRoute>
      }
       />

<Route
      path="/admin/users"
      element={
        <ProtectRoute user={user}>
            <UserManagement />
        </ProtectRoute>
      }
       />

<Route
      path="/admin/chats"
      element={
        <ProtectRoute user={user}>
            <ChatManagement />
        </ProtectRoute>
      }
       /> */}



<Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/chats" element={<ChatManagement />} />
          <Route path="/admin/messages" element={<MessagesManagement />} />











         <Route
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login />
              </ProtectRoute>
            }
          />



 
      {/* <Route path="/login" element={<Login />} /> */}
      <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
    <Toaster position='bottom-center' />
    </BrowserRouter>
  )
}

export default App