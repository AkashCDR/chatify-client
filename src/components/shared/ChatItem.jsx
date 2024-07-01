import React from 'react'
import { Link } from '../styles/StyledComponents'
import {Stack} from '@mui/material'
import {Typography,Box} from '@mui/material'
import { memo } from 'react'
import AvatarCard from './AvatarCard'


const ChatItem = ({
    avatar = [],
  name="test",
  _id,
  groupChat = false,
  sameSender,
  isOnline=true,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {



    
  return (
    <Link sx={{padding:"0rem"}} to={`/chat/${_id}`} onContextMenu={(e)=> handleDeleteChat(e,_id,groupChat)}>

    <div
    style={{
        display:"flex",
        alignItems:"center",
        gap:"1rem",
        padding:"1rem",
        backgroundColor:sameSender?"black":"unset",
        color:sameSender?"white":"black",
        position:"relative",
        
    }}
    >

    <AvatarCard avatar={avatar} />

    <Stack>
        <Typography>{name}</Typography>
        {
            newMessageAlert && (
                <Typography>{newMessageAlert.count} new message</Typography>
            )
        }
    </Stack>
    {
        isOnline && (
            <Box 
            style={{
                width:"10px",
                height:"10px",
                position:"absolute",
                borderRadius:"50%",
                backgroundColor:"green",
                right:"1rem",
                top:"25%"
            }}
             />
        )
    }
    

    

    </div>

    </Link>
  )
}

export default memo(ChatItem)