import React, { Fragment, useState,useCallback } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { useRef } from 'react'
import {Stack,IconButton} from '@mui/material'
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material'
import { InputBox } from '../components/styles/StyledComponents'
import FileMenu from '../components/dialogs/FileMenu'
import MessageComponent from '../components/specific/MessageComponent'
import { sampleMessage } from '../components/constants/sampleData'
import { getSocket } from '../socket'
import { NEW_MESSAGE,START_TYPING,STOP_TYPING,ALERT } from '../components/constants/event'
import { useChatDetailsQuery } from '../redux/api/api'
import { useErrors, useSocketEvents } from '../hooks/hook'
import { useGetMessagesQuery } from '../redux/api/api'
import {useInfiniteScrollTop} from "6pp"
import { useDispatch } from 'react-redux'
import { setIsFileMenu } from '../redux/reducers/misc'
import { useEffect } from 'react'
import { removeNewMessagesAlert } from '../redux/reducers/chat'
import { TypingLoader } from '../components/layout/Loaders'
import { useNavigate } from 'react-router-dom'
import { CHAT_JOINED,CHAT_LEAVED } from '../components/constants/event'

const Chat = ({chatId,user}) => {

  const socket=getSocket();
  const [message,setMessage]=useState("");
  const [messages,setMessages]=useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor,setFileMenuAnchor]=useState(null);
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const containerRef=useRef();
  const bottomRef=useRef(null);
  const dispatch=useDispatch();
  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);
  const navigate=useNavigate();


  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });
  // const user={
  //   _id:"sdfsdfsdf",
  //   name:"Akash Shaw"
  // }
  const members = chatDetails?.data?.chat?.members;


  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, [2000]);
  };



  const handleFileOpen=(e)=>{
   dispatch(setIsFileMenu(true));
   setFileMenuAnchor(e.currentTarget);
  }

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const submitHandler=(e)=>{
    e.preventDefault();

    if(!message.trim()) return;

    socket.emit(NEW_MESSAGE,{chatId,members,message});

    setMessage("");
  }

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);


  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );





  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );


  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);




  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "djasdhajksdhasdsadasdas",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );






  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener, 
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  useErrors(errors);

  useSocketEvents(socket, eventHandler);

  

  const allMessages = [...oldMessages, ...messages];

  return (
    <Fragment>
      <Stack
      ref={containerRef}
      boxSizing={"border-box"}
      height={"85%"}
      padding={"1rem"}
      spacing={"1rem"}
      sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >

  
{/* {!oldMessagesChunk && oldMessagesChunk?.data.messages.map((i)=>{
        return <MessageComponent message={i} user={user} />
      })
    } */}
    {    allMessages.map((i)=>{
        return <MessageComponent message={i} user={user} />
      })}

      {userTyping && <TypingLoader />}

      <div ref={bottomRef} />



      </Stack>


      <form style={{height:"15%"}} onSubmit={submitHandler}>

       <Stack
       direction={"row"}
       alignItems={"center"}
       padding={"1rem"}
       position={"relative"}
       height={"100%"}
       >
        <IconButton  onClick={handleFileOpen}>
        <AttachFileIcon />
        </IconButton>
        <InputBox
         placeholder="Type your message here..."
        //  onChange={messageOnChange} 
        value={message}
        onChange={messageOnChange}
        height={"100%"}
         />
        <IconButton
        type="submit"
        sx={{
          bgcolor:"orange",
          color:"white",
          "&:hover":{
            bgcolor:"error.dark"
          },
          marginLeft:"1rem"
        }}
        >
          <SendIcon />
        </IconButton>
       </Stack>

      </form>

     <FileMenu anchorEl={fileMenuAnchor} chatId={chatId} />




    </Fragment>
  )
}

export default AppLayout()(Chat)