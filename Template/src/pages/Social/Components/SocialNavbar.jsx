import { useEffect } from "react";
// import Header from "../../../Layouts/Header";
// import Logo from "../../Projets/Components/Logo";
// import Searchbar from "../../Projets/Components/Searchbar";
// import Notifications from "../Notifications/Notifications";
// import Messenger from "../../../Icons/icones/messenger.png";
// import Home from "../../../Icons/icones/house-black-silhouette-without-door.png";
import { Link } from "react-router-dom";

export default function SocialNavbar() {
  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("login-page");

    return () => {
      root.classList.remove("login-page");
    };
  }, []);

  return (
    <nav className="w-full flex flex-col md:flex-row items-center justify-between bg-white gap-4 px-4 py-2">
      {/* <Logo />

      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        <Searchbar placeholder="Rechercher des groupes" />
      </div>

      <div className="flex items-center gap-4">
        {window.location.pathname.includes("/dashboard/social/groups/") || window.location.pathname.includes("/dashoboard/social/notifications/") && (
          <Link to="/dashboard/social/actus">
            <img src={Home} className="w-8 h-8" />
          </Link>
        )}
        <Link to="/dashboard/messenger/">
          <img src={Messenger} className="w-8 h-8" />
        </Link>
        <Notifications />
        <Header />
      </div> */}
    </nav>
  );
}
