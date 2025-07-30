import Logo from "../../images/image005.png";
import image from '../../images/cover_image.jpg';
export default function Cover() {
    return <div className="flex flex-col h-full bg-white">
        <div className="flex items-center justify-start px-3 py-2">
            <img alt='Logo' src={Logo} className="h-12 w-40"/>
        </div> 
        <div>
            <img alt="Cover" src={image} className="h-full"/>
        </div>
    </div>
}