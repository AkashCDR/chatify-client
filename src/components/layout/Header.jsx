import React, { Suspense, useState } from 'react'
import { lazy } from 'react';
import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import {orange} from "../constants/color"
import {
  Add as AddIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import {useNavigate} from "react-router-dom"
import { server } from '../constants/config';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios';
import {userNotExists} from "../../redux/reducers/auth"
const SearchDialog=lazy(()=>import("../specific/Search"));
const NotifcationDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));
import { setIsMobile,setIsSearch,setIsNotification, setIsNewGroup } from '../../redux/reducers/misc';
import {resetNotificationCount } from '../../redux/reducers/chat';





const Header = () => {

  const navigate=useNavigate();
  const dispatch=useDispatch();

  const {isSearch,isNewGroup}=useSelector((state)=>state.misc)
// const [isMobile,setIsMobile]=useState(false);

// const [isSearch,setIsSearch]=useState(false);
// const [isNewGroup,setIsNewGroup]=useState(false);

// const [isNotification,setIsNotification]=useState(false);

const {isNotification}=useSelector((state)=>state.misc)
const {notificationCount}=useSelector((state)=>state.chat)


const openSearch=()=>{
  dispatch(setIsSearch(true))
}
const handleMobile=()=>{
  // setIsMobile((prev)=>!prev)
  dispatch(setIsMobile(true));
}
const openNewGroup=()=>{
  // setIsNewGroup((prev)=>!prev)
  dispatch(setIsNewGroup(true));
}
const navigateToGroup=()=>{
  navigate("/groups");
}
const openNotification=()=>{
  dispatch(resetNotificationCount());
  dispatch(setIsNotification(true));
}
const logoutHandler = async () => {
  try {
    // console.log("here 1")
    const { data } = await axios.get(`${server}/api/v1/user/logout`, {
      withCredentials: true,
    });
    // console.log("here 2")
    dispatch(userNotExists());
    // console.log("here 3")
    toast.success(data.message);
    // console.log("here 4")
  } catch (error) {
    console.log(error)
    toast.error(error?.response?.data?.message || "Something went wrong");
  }
};










  return (
    <>
    <Box sx={{ flexGrow: 1 }} height={"4rem"}>
      <AppBar
        position="static"
        sx={{
          bgcolor: orange,
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              display: { xs: "none", sm: "block" },
            }}
          >
            CHATIFY
          </Typography>

          <Box
            sx={{
              display: { xs: "block", sm: "none" },
            }}
          >
            <IconButton color="inherit" onClick={handleMobile}>
              <MenuIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
            }}
          />
          <Box>
            <IconBtn
              title={"Search"}
              icon={<SearchIcon />}
              onClick={openSearch}
            />

            <IconBtn
              title={"New Group"}
              icon={<AddIcon />}
              onClick={openNewGroup}
            />

            <IconBtn
              title={"Manage Groups"}
              icon={<GroupIcon />}
              onClick={navigateToGroup}
            />

            <IconBtn
              title={"Notifications"}
              icon={<NotificationsIcon />}
              onClick={openNotification}
              value={notificationCount}
            />

            <IconBtn
              title={"Logout"}
              icon={<LogoutIcon />}
              onClick={logoutHandler}
            />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
    {
      isSearch && (
        <Suspense fallback={<Backdrop open />}>
           <SearchDialog />
        </Suspense>
      )
    }
    {
      isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <NotifcationDialog />
        </Suspense>
      )
    }
    {
      isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
           <NewGroupDialog />
        </Suspense>
      )
    }
</>
  )
}

const IconBtn=({title,icon,onClick,value})=>{

  return (
    <Tooltip title={title}>
       <IconButton color="inherit" onClick={onClick}>
       {value ? (
          <Badge badgeContent={value} color="error">
            {icon}
          </Badge>
        ) : (
          icon
        )}
       </IconButton>
    </Tooltip>
  )

}

export default Header