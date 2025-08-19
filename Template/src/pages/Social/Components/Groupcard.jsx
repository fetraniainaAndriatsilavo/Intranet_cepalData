import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";

function Groupcard({ group }) {
  return (
    <Link to={"/social/groups/" + group.id}>
      <div className="flex items-center p-3 hover:bg-gray-100 cursor-pointer transition rounded-lg bg-white border-white mt-1.5">
        <div className="bg-white-500 w-10 h-10 rounded-full overflow-hidden mr-3 p-1 flex items-center justify-center">
          <Avatar> {group.name.charAt(0) } </Avatar>
        </div>
        <div className="flex flex-col">
          <h1 className="font-semibold text-gray-900 mb-1"> {group.name} </h1>
        </div>
      </div>
    </Link>
  );
}

export default Groupcard;
