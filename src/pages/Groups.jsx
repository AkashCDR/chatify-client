import { lazy } from 'react'
import {Menu as MenuIcon,KeyboardBackspace as KeyboardBackspaceIcon, Done as DoneIcon, Edit as EditIcon } from '@mui/icons-material'
import { IconButton,Box,Typography, Tooltip, Drawer,Grid,Stack, TextField} from '@mui/material'
import React, { Suspense, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { samepleChats, sampleUsers } from '../components/constants/sampleData'
import {bgGradient,matBlack} from '../components/constants/color'
import AvatarCard from '../components/shared/AvatarCard'
import { Link } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
const ConfirmDeleteDialog=lazy(()=>import("../components/dialogs/ConfirmDeleteDialog"))
import {Button} from '@mui/material'
import { Delete as DeleteIcon,Add as AddIcon } from '@mui/icons-material'
import AddMemberDialog from '../components/dialogs/AddMemberDialog'
import UserItem from '../components/shared/UserItem'
import { useMyGroupsQuery,useChatDetailsQuery,useRemoveGroupMemberMutation } from '../redux/api/api'
import { useErrors } from '../hooks/hook'
import { useRenameGroupMutation,useDeleteChatMutation } from '../redux/api/api'
import { useAsyncMutation } from '../hooks/hook'
import { useDispatch, useSelector } from 'react-redux'
import { setIsAddMember} from '../redux/reducers/misc'


const Groups = () => {
  const chatId = useSearchParams()[0].get("group");
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const {isAddMember}=useSelector((state)=>state.misc);
  const [isMobileMenuOpen,setIsMobileMenuOpen]=useState(false);
  const [groupName,setGroupName]=useState("");
  const [groupNameUpdatedValue,setGroupNameUpdatedValue]=useState("");
  const [members,setMembers]=useState([]);
  const [isEdit,setIsEdit]=useState(false);
  // const [isAddMember,setIsAddMember]=useState(false);
  const myGroups=useMyGroupsQuery("");
  const [updateGroup, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation
  );

  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(
    useDeleteChatMutation
  );
  
  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];

  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMemberMutation
  );

  useErrors(errors);


  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating Group Name...", {
      chatId,
      name: groupNameUpdatedValue,
    });
  };



  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [chatId]);
  
  const [confirmDeleteDialog,setConfirmDeleteDialog]=useState(false);

   const openConfirmDeleteHandler=()=>{
    setConfirmDeleteDialog(true);
   }

  const handleMobile=()=>{
    setIsMobileMenuOpen((prev)=>!prev);
  }

  const deleteHandler=()=>{
    deleteGroup("Deleting Group...", chatId);
    closeConfirmDeleteHandler();
    navigate("/groups");
  }

  const closeConfirmDeleteHandler=()=>{
    setConfirmDeleteDialog(false);
  }
  
  const navigateBack=()=>{
    navigate("/");
  }

  const removeMemberHandler=(userId)=>{
    removeMember("Removing Member...", { chatId, userId });
  }

  const openAddMemberHandler=()=>{
    dispatch(setIsAddMember(true));
  }

  const closeAddMemberHandler=()=>{
    dispatch(setIsAddMember(false));
  }

  const handleMobileClose=()=>{
    setIsMobileMenuOpen(false)
  }

  const updateGrouName=()=>{
    setGroupName(groupNameUpdatedValue);
    setIsEdit(false);
  }

  useEffect(() => {
    const groupData = groupDetails.data;
    if (groupData) {
      setGroupName(groupData.chat.name);
      setGroupNameUpdatedValue(groupData.chat.name);
      setMembers(groupData.chat.members);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);


  const IconBtns=(
    <>
    <Box
    sx={{
      display:{
        xs:"block",
        sm:"none"
      },
      position:"fixed",
      top:"1rem",
      right:"1rem"
    }}
    >
       <IconButton onClick={handleMobile}>
        <MenuIcon />
       </IconButton>
    </Box>

    <Tooltip title={"back"}>
        <IconButton
        sx={{
            position: "absolute",
            top: "2rem",
            left:{
                xs:"5%",
                sm:"35%"
            },
            bgcolor: matBlack,
            color: "white",
            ":hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
    </Tooltip>
    </>
  )


  const ButtonGroup = (
    <Stack
      direction={{
        xs: "column-reverse",
        sm: "row",
      }}
      spacing={"1rem"}
      p={{
        xs: "0",
        sm: "1rem",
        md: "1rem 4rem",
      }}
    >
      <Button
        size="large"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={openConfirmDeleteHandler}
      >
        Delete Group
      </Button>
      <Button
        size="large"
        variant="contained"
        startIcon={<AddIcon />}
        onClick={openAddMemberHandler}
      >
        Add Member
      </Button>
    </Stack>
  );











  const GroupName=(
    <Stack
    direction={"row"}
    alignItems={"center"}
    margin={"2rem"}
    display={"flex"}
    justifyContent={"center"}
    spacing={"2rem"}
    >
      {
        isEdit ? <>
           <TextField
           value={groupNameUpdatedValue}
           onChange={(e)=>setGroupNameUpdatedValue(e.target.value)}
           >
           </TextField>
           <IconButton>
            <DoneIcon onClick={updateGroupName} cursor={"pointer"} fontSize={"large"} />
           </IconButton>
        </>:<>
        <Typography variant={"h4"}>
        {groupName}
        </Typography>
          
          <EditIcon 
            onClick={()=>setIsEdit(true)}
            cursor={"pointer"}
            fontSize={"large"}
            disabled={isLoadingGroupName}
          />
        </>
      }
    </Stack>
  )









  return (
    <Grid container height={"100vh"}>


      <Grid
      sm={4}
      sx={{
        display:{
          xs:"none",
          sm:"block"
        }
      }}
      >

      <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />

      </Grid>


      <Grid
      xs={12}
      sm={8}
      >
        {IconBtns}
        {
          groupName?<>
               {GroupName}
               <Typography
              margin={"2rem"}
              alignSelf={"flex-start"}
              variant="body1"
            >
              Members
            </Typography>

            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              padding={{
                sm: "1rem",
                xs: "0",
                md: "1rem 4rem",
              }}
              spacing={"2rem"}
              height={"50vh"}
              overflow={"auto"}
            >
            {
              members.length > 0 && 
              members.map((i)=>{
                return <UserItem 
                    user={i}
                    key={i._id}
                    handler={removeMemberHandler}
                 />
              })
              
            }
            </Stack>

            {ButtonGroup}
          </>:<>
              <Typography>No group name found</Typography>
          </>
        }
      </Grid>

      <Drawer
      open={isMobileMenuOpen}
      onClose={handleMobileClose}
      sx={{
        display:{
          xs:"block",
          sm:"none"
        }
      }}
      >
      <GroupsList w={"50vw"} myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Drawer>

      {
        isAddMember && (
          <Suspense fallback={<div>Loading...</div>}>
            <AddMemberDialog chatId={chatId} open={isAddMember} closeHandler={closeAddMemberHandler} />
          </Suspense>
        )
      }

      {
        confirmDeleteDialog && (
            <Suspense fallback={<div>loading...</div>}>
            <ConfirmDeleteDialog open={confirmDeleteDialog} handleClose={closeConfirmDeleteHandler} deleteHandler={deleteHandler} />
            </Suspense>
        )
        
      }


    </Grid>
  )
}


const GroupsList = ({ w = "100%", myGroups = [], chatId }) => (
  <Stack
    width={w}
    sx={{
      backgroundImage: bgGradient,
      height: "100vh",
      overflow: "auto",
    }}
  >
 
    {myGroups.length > 0 ? (
      
      myGroups.map((group) => (
        <GroupListItem w={"50vw"} group={group} chatId={chatId} key={group._id} />
      ))
    ) : (
      <Typography textAlign={"center"} padding="1rem">
        No groups
      </Typography>
    )}
  </Stack>
);

const GroupListItem=({group,chatId})=>{
  console.log(group);
   const {name,avatar,_id}=group;
   return (
    <Link 
    onClick={(e)=>{
      if(chatId===_id) e.preventDefault();
      }
      }
       to={`?group=${_id}`}
       >
    <Stack direction={"row"} spacing={"1rem"} alignItems={"center"} padding={"0.5rem"}>
      <AvatarCard avatar={avatar} />
      <Typography>{name}</Typography>
    </Stack>
    </Link>
   
   )
}





export default Groups