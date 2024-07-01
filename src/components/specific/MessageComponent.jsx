import React from 'react'
import {Typography,Box} from "@mui/material"
import moment from 'moment';
import { fileFormat } from '../../lib/Features';
import RenderAttachment from '../shared/RenderAttachment';

const MessageComponent = ({message,user}) => {
    const {sender,content,attachments=[],createdAt}=message;
    const sameSender = sender?._id == user?._id;
    const timeAgo=moment(createdAt).fromNow();
  return (
    <div
    style={{
        alignSelf:sameSender?"flex-end":"flex-start",
        color:sameSender?"white":"black",
        backgroundColor:sameSender?"#4c5dfc":"#edeef5",
        borderRadius:"25px",
        padding:"10px",
        width:"fit-content"
    }}
    >
    {!sameSender && <Typography style={{color:"blue"}}>{sender.name}</Typography>}
    {<Typography>{content}</Typography>}
    {
      attachments.length>0 && 
      attachments.map((attachment,index)=>{
        const url=attachment.url;
          const file=fileFormat(url);
        return (
          <Box key={index}>
           <a href={url} download>{RenderAttachment(file,url)}</a>
          </Box>
        )
      })
    }
    {<Typography variant='caption' >{timeAgo}</Typography>}
    </div>
  )
}

export default MessageComponent