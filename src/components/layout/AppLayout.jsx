import React, { useCallback } from 'react'
import Header from './Header'
import Title from '../shared/Title'
import {Grid, Skeleton} from "@mui/material";
import ChatList from '../specific/ChatList';
import { samepleChats } from '../constants/sampleData';
import {useNavigate, useParams} from 'react-router-dom'
import Profile from '../specific/Profile';
import { useMyChatsQuery } from '../../redux/api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMobile } from '../../redux/reducers/misc';
import {Drawer} from '@mui/material';
import { useErrors, useSocketEvents } from '../../hooks/hook';
import { getSocket } from '../../socket';
import { incrementNotification } from '../../redux/reducers/chat';
import { NEW_REQUEST,NEW_MESSAGE_ALERT,REFETCH_CHATS,ONLINE_USERS} from '../constants/event';
import { setNewMessagesAlert } from '../../redux/reducers/chat';
import { getOrSaveFromStorage } from '../../lib/Features';
import { useEffect } from 'react';
import { setIsDeleteMenu,setSelectedDeleteChat } from '../../redux/reducers/misc';
import DeleteChatMenu from '../dialogs/DeleteChatMenu';
import { useRef } from 'react';
import { useState } from 'react';

const AppLayout = ()=> (WrappedComponent) => {

    return (props)=>{
      

      const dispatch=useDispatch()
      const params=useParams();
      const chatId=params.chatId;
      const socket=getSocket();
      const navigate=useNavigate();
      const deleteMenuAnchor = useRef(null);

      console.log(socket.id);
      const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");
      const {isMobile} = useSelector((state)=>state.misc)
      const {user}=useSelector((state)=>state.auth)
      const {newMessagesAlert}=useSelector((state)=>state.chat)
      const handleMobileClose=()=>dispatch(setIsMobile(false));
      const [onlineUsers, setOnlineUsers] = useState([]);


      useEffect(() => {
        getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
      }, [newMessagesAlert]);

      const newMessageAlertListener=useCallback((data)=>{
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },[chatId])

      const newRequestListener = useCallback(() => {
        dispatch(incrementNotification());
      }, [dispatch]);

      const refetchListener = useCallback(() => {
        refetch();
        navigate("/");
      }, [refetch, navigate]);

      const onlineUsersListener = useCallback((data) => {
        
        console.log("online users",data)
        setOnlineUsers(data);
      }, []);
  
      const eventHandlers = {
        [NEW_MESSAGE_ALERT]: newMessageAlertListener,
        [NEW_REQUEST]: newRequestListener,
        [REFETCH_CHATS]: refetchListener,
        [ONLINE_USERS]: onlineUsersListener,
      };
  

      const handleDeleteChat=(e, chatId, groupChat)=>{
        dispatch(setIsDeleteMenu(true));
        dispatch(setSelectedDeleteChat({ chatId, groupChat }));
        deleteMenuAnchor.current = e.currentTarget;
        }


      useSocketEvents(socket, eventHandlers);
      

      useErrors([{ isError, error }]);

        return (




            <>
              <Title />
              <Header />

              <DeleteChatMenu deleteMenuAnchor={deleteMenuAnchor} dispatch={dispatch} />

              {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer open={isMobile} onClose={handleMobileClose}>
            <ChatList
              w="70vw"
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
              onlineUsers={onlineUsers}
            />
          </Drawer>
        )}



              <Grid container height={"calc(100vh - 4rem)"}>
                <Grid
                item
            sm={4}
            md={3}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
            height={"100%"}
            >
            {
              isLoading ? (<Skeleton />) : (
                <ChatList chats={data?.chats} chatId={chatId} newMessagesAlert={newMessagesAlert} onlineUsers={onlineUsers}  handleDeleteChat={handleDeleteChat} />
              )
            }   
            {/* <ChatList chats={samepleChats}  handleDeleteChat={handleDeleteChat} /> */}
                </Grid>


                <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
                <WrappedComponent {...props} chatId={chatId} user={user} />
                </Grid>


                <Grid 
                 item
            md={4}
            lg={3}
            height={"100%"}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: "rgba(0,0,0,0.85)",
            }}
                >
                  <Profile user={user}  />
                </Grid>
              </Grid>
              
              <div >Footer</div>
            </>
             
          )
    }

}

export default AppLayout