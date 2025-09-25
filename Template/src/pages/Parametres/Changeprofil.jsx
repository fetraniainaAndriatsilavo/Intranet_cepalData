import { Avatar } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import api from "../../components/axios";
import ProfileMale from "../../images/utilisateur.png";
import ProfileFemale from "../../images/user0.png"

export default function Changeprofil() {
    const { user } = useContext(AppContext)
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [loading, setLoading] = useState(false)
    const [userInformation, setUserInformation] = useState({})

    const fetchUserProfil = (id) => {
        api.get('/user/' + id + '/info')
            .then((response) => {
                const data = response.data.user
                setUserInformation(data)
                setProfilePhoto(data.image)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleProfileUpload = (e, id) => {
        setLoading(true)
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            api.post('/users/' + id + '/upload-image', formData
            )
                .then(() => {
                    setLoading(false);
                    fetchUserProfil(user.id)
                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                })
        }
    };


    useEffect(() => {
        fetchUserProfil(user.id)
    }, [user])

    return <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-6">
        <div className="mb-4 sm:mb-0 flex items-center justify-center w-full">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold"> Changer de photo de profil </h1>
        </div>
        <div className="bg-white w-1/2 rounded p-3 shadow-sm border border-gray-100 space-y-2">
            <div className="relative mb-20 rounded overflow-hidden bg-white flex items-center justify-center">
                <div className="pt-3 px-6 pb-6">
                    <div className=" flex flex-col mb-2 justify-center items-center">
                        <Avatar
                            src={
                                userInformation && userInformation.image ? userInformation.image : userInformation.gender == 'male' ?
                                    ProfileMale : userInformation.gender == 'female' ? ProfileFemale : ''
                            }
                            alt="Profile"
                            sx={{ width: 120, height: 120, border: '4px solid white' }}
                        />
                    </div>
                    <div className="mb-3 flex flex-col gap-1">
                        <span className="font-semibold text-xl text-center"> {user.last_name + ' ' + user.first_name} </span>
                        <span className="text-center">{user.email} </span>
                    </div>
                    <label className="flex items-center justify-center w-full uppercase mt-2 bg-white text-sm px-4 py-2 rounded shadow cursor-pointer hover:bg-gray-100 border-2 border-sky-600 text-sky-600 hover:border-none hover:bg-sky-600 hover:text-white">
                        {loading ? 'Import en cours...' : 'Importer une photo'}
                        <input type="file" accept="image/*" name="image" id="image" className="hidden" onChange={(e) => {
                            handleProfileUpload(e, user.id)
                        }} />
                    </label>
                </div>
            </div>
        </div>
    </div>
}