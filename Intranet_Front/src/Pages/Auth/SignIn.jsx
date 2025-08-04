import Connexion from "../../Components/Authentification/Connexion";
import Cover from "../../Components/Authentification/Cover";

export default function SignIn() {
    return <div className="w-full flex flex-col md:flex-row h-screen" > 
        <div className="hidden xs:hidden md:flex md:w-2/3 h-full items-center justify-center">
            <Cover />
        </div>
        <div className="sm:h-full xs:h-full lg:1/2 w-full md:w-1/3 h-1/2 md:h-full opacity-95 flex items-center justify-center">
            <Connexion />
        </div>
    </div>
}
// style={{ backgroundColor: '#04adf0' }}