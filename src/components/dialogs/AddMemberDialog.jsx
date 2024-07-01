import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    Skeleton,
    Stack,
    Typography,
  } from "@mui/material";

  import { sampleUsers } from "../constants/sampleData";
  import UserItem from "../shared/UserItem"
  import { useAddGroupMembersMutation,useAvailableFriendsQuery} from "../../redux/api/api";
  import { useAsyncMutation} from "../../hooks/hook";

const AddMemberDialog = ({open,chatId,closeHandler}) => {

  const [addMembers, isLoadingAddMembers] = useAsyncMutation(
    useAddGroupMembersMutation
  );

  

    const [selectedMembers, setSelectedMembers] = useState([]);

    const addMemberSubmitHandler=()=>{
      addMembers("Adding Members...", { members: selectedMembers, chatId });
      closeHandler();
    }

    const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);


    const selectMemberHandler = (id) => {
      setSelectedMembers((prev) =>
        prev.includes(id)
          ? prev.filter((currElement) => currElement !== id)
          : [...prev, id]
      );
    };


  return (
    <Dialog open={open} onClose={closeHandler}>
        <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>Add Member</DialogTitle>

        <Stack spacing={"1rem"}>
          {isLoading ? (
            <Skeleton />
          ) : data?.friends?.length > 0 ? (
            data?.friends?.map((i) => (
              <UserItem
                key={i._id}
                user={i}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          ) : (
            <Typography textAlign={"center"}>No Friends</Typography>
          )}
        </Stack>

        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          <Button color="error" onClick={closeHandler}>
            Cancel
          </Button>
          <Button
            onClick={addMemberSubmitHandler}
            variant="contained"
            disabled={isLoadingAddMembers}
          >
            Submit Changes
          </Button>
        </Stack>

        </Stack>
    </Dialog>
  )
}

export default AddMemberDialog