import { Button } from "@mui/material";
import GroupEdit from "./GroupEdit";
import api from "../../../components/axios";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import CoverPhoto from "../../../images/360_F_467961418_UnS1ZAwAqbvVVMKExxqUNi0MUFTEJI83.jpg";
export default function GroupInfo({ GroupId }) {

  const { user } = useContext(AppContext)
  const [group, setGroup] = useState({
    name: '',
    members: [],
    id: ''
  })
  const [open, setOpen] = useState(false);

  const onClose = () => {
    if (open) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };


  useEffect(() => {
    api
      .get("/getMembersGroup/" + GroupId)
      .then((response) => {
        const group = response.data.group
        const members = response.data.members
        setGroup({
          id: group.id,
          name: group.name,
          members: members
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }, [GroupId]);



  const leaveGroup = (GroupId, id) => {
    api
      .delete(
        "groups/" + GroupId + "/members/" + id + "/remove"
      )
      .then((response) => {
        window.location.href = '/social'
      })
      .catch((error) => {
        console.log(error);
      });
  }; 

  const deleteGroup = (GroupId) => {
    api
      .delete(
        "groups/" + GroupId
      )
      .then((response) => {
        window.location.href = '/social'
      })
      .catch((error) => {
        console.log(error);
      });
  }


  return (
    <div className="w-2/3">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="relative h-60 bg-gray-300">
          <img src={CoverPhoto} alt="Cover" className="w-full h-full object-cover" />
        </div>
        <div className="mt-5 px-6 pb-6 flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold flex gap-3 items-center">
              {group.name}
            </h1>
            <p className="text-gray-600"> {group.members.length}  Membres </p>
          </div>
          <div className="flex gap-3 items-center flex-row">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setOpen(!open)
              }}

            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-pencil cursor-pointer">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                <path d="M13.5 6.5l4 4" />
              </svg>
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={(e) => {
                if (confirm("Voulez-vous vraiment quitter ce groupe ?")) {
                  e.preventDefault();
                  leaveGroup(GroupId, user.id);
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-door-exit">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M13 12v.01" />
                <path d="M3 21h18" />
                <path d="M5 21v-16a2 2 0 0 1 2 -2h7.5m2.5 10.5v7.5" />
                <path d="M14 7h7m-3 -3l3 3l-3 3" />
              </svg>
            </Button>

            <Button
              variant="outlined"
              color="warning"
              onClick={(e) => {
                if (confirm("Voulez-vous vraiment supprimer ce groupe ?")) {
                  e.preventDefault();
                  deleteGroup(GroupId);
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-trash">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 7l16 0" />
                <path d="M10 11l0 6" />
                <path d="M14 11l0 6" />
                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
      {open && (
        <GroupEdit
          open={open}
          onClose={onClose}
          GroupId={GroupId}
        >
          {" "}
        </GroupEdit>
      )}
    </div>
  );
}
