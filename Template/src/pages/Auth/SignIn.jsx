import { matchPath, useLocation } from "react-router-dom";
import Connexion from "../../Components/Authentification/Connexion";
import Cover from "../../Components/Authentification/Cover";
import SendEmail from "../../components/Authentification/SendEmail";
import ResetPassword from "../../components/Authentification/ResetPassword";
import { useState } from "react";

export default function SignIn() {
  const location = useLocation();
  const { pathname } = location;

  return (
    <div className="w-full flex flex-col md:flex-row h-screen ">
      <div className="hidden xs:hidden md:flex md:w-1/2 h-full items-center justify-center">
        <Cover />
      </div>
      <div className="h-full lg:1/2 w-full md:w-1/2 h-1/2 md:h-full opacity-95 flex items-center justify-center">
        {pathname == "/" && <Connexion />}
        {pathname == "/reset" && <SendEmail />}
        {matchPath("/changepswd/:token/:email", pathname) && <ResetPassword />}
      </div>
    </div>
  );
}
