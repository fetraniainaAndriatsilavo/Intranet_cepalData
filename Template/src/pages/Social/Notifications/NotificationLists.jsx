import { Link } from "react-router-dom";
function NotificationLists({ notification }) {
  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-60 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-2 border-b-1">
        <h1 className="font-bold text-lg"> Notifications </h1>
      </div>
      <ul className="py-2 text-gray-800">
        {notification ?
          notification.map((notif, key) => (
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2" key={key}>
              <div className="flex flex-row">
                <p className="text-sm"> {notif.data.message}</p>
              </div>
            </li>
          )) : <span className="text-sm text-center flex items-center justify-center italic">
            Aucune notifications pour l'instant
          </span>}
      </ul>
      <div className="p-2 text-center bg-sky-50 ">
        <Link to={'/dashoboard/social/notifications/'} className="text-sky-500">
          Tous les notifications </Link>
      </div>
    </div>
  );
}

export default NotificationLists;
