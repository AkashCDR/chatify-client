import React, { useState } from 'react'
import {Stack,Dialog,DialogTitle,List,Button,Typography} from "@mui/material"
import { TextField } from '@mui/material';
import {useInputValidation} from "6pp"
import { sampleUsers } from '../constants/sampleData';
import UserItem from '../shared/UserItem';
import { useDispatch, useSelector } from 'react-redux';
import { setIsNewGroup } from '../../redux/reducers/misc';
import { useAvailableFriendsQuery,useNewGroupMutation } from '../../redux/api/api';
import { useAsyncMutation } from '../../hooks/hook';
import toast from 'react-hot-toast';

const NewGroup = () => {
  const groupName=useInputValidation("");
const [selectedMembers,setSelectedMembers]=useState([]);
const {isNewGroup}=useSelector((state)=>state.misc);
const dispatch=useDispatch();
const { isError, isLoading, error, data } = useAvailableFriendsQuery();
const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

const selectMemberHandler=(id)=>{
          setSelectedMembers((prev)=> prev.includes(id)?prev.filter((ele)=>ele!==id) : [...prev,id]);
}

const closeHandler=()=>{
dispatch(setIsNewGroup(false));
}

const submitHandler=()=>{
  if (!groupName.value) return toast.error("Group name is required");

    if (selectedMembers.length < 2)
      return toast.error("Please Select Atleast 3 Members");

    newGroup("Creating New Group...", {
      name: groupName.value,
      members: selectedMembers,
    });

    closeHandler();
}

console.log(selectedMembers);


  

  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>

    <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={"2rem"}>

    <DialogTitle>
      New Group
    </DialogTitle>

    <TextField label="group name" value={groupName.value} onChange={groupName.changeHandler} ></TextField>

    <Typography variant="body1">Members</Typography>

    <List>
      {
        data?.friends?.map((user)=>{
          return <UserItem key={user._id} handler={selectMemberHandler} isAdded={selectedMembers.includes(user._id)} user={user} />
        })
      }
      
    </List>

    <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button
            variant="text"
            color="error"
            size="large"
            onClick={closeHandler}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={submitHandler}
            disabled={isLoadingNewGroup}
          >
            Create
          </Button>
        </Stack>

    </Stack>

    </Dialog>
  )
}

export default NewGroup