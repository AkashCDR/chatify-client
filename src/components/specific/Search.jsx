import React, { useEffect, useState } from 'react'
import {useInputValidation} from '6pp'
import {Dialog,DialogTitle,InputAdornment,Stack} from "@mui/material"
import { TextField,List } from '@mui/material';
import {  Search as SearchIcon } from '@mui/icons-material';
import { sampleUsers } from '../constants/sampleData';
import UserItem from '../shared/UserItem';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSearch } from '../../redux/reducers/misc';
import { useLazySearchUserQuery } from '../../redux/api/api';
import { useAsyncMutation } from '../../hooks/hook';
import { useSendFriendRequestMutation } from '../../redux/api/api';

const Search = () => {
  const search=useInputValidation("");
  const {isSearch}=useSelector((state)=>state.misc)
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );
  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend request...", { userId: id });
  };
     const [searchUser]=useLazySearchUserQuery();
     const dispatch=useDispatch();
     const searchCloseHandler=()=>dispatch(setIsSearch(false))


    const [users,setUsers]=useState([]);

    useEffect(() => {
      const timeOutId = setTimeout(() => {
        searchUser(search.value)
          .then(({ data }) => setUsers(data.users))
          .catch((e) => console.log(e));
      }, 1000);
  
      return () => {
        clearTimeout(timeOutId);
      };
    }, [search.value]);



  
  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
    <Stack padding={"3rem"} direction={"column"}>
    <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField 
        label=""
        value={search.value}
        onChange={search.changeHandler}
        size="small"
        InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
         />

         <List>
          {
            users.map((user)=>{
            return <UserItem user={user} key={user._id} handler={addFriendHandler} handlerIsLoading={isLoadingSendFriendRequest} />
            })
          }
         </List>
         
    </Stack>
     
    </Dialog>
  )
}

export default Search