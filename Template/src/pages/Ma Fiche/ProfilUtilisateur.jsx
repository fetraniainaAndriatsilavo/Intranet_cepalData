import { Avatar } from "@mui/material";
import api from "../../components/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../Social/Posts/Post";

export default function ProfilUitlisateur() {
    const { UserId } = useParams()
    const [userInformation, setUserInformation] = useState({})
    const [userPosts, setUserPosts] = useState([])

    const fetchUserInofrmation = (id) => {
        api.get('/user/' + id + '/info')
            .then((response) => {
                setUserInformation(response.data.user)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const fetchUserPost = (id) => {
        api.get('/posts/user/' + id)
            .then((response) => {
                setUserPosts(response.data.posts)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        fetchUserInofrmation(UserId)
        fetchUserPost(UserId)
    }, [UserId])

    //  style={{ backgroundImage: "url('/src/images/360_F_467961418_UnS1ZAwAqbvVVMKExxqUNi0MUFTEJI83.jpg')" }}  
    // <div className="h-52 w-full bg-cover bg-center relative">
    return (
        <div className="bg-light h-full flex justify-center">
            <div className="w-full">
                <div className="mb-10 rounded shadow overflow-hidden bg-white flex flex-row items-center">
                    <div>
                        <Avatar
                            src={userInformation && userInformation.image == null && userInformation.gender == 'male' ?
                                "/src/images/utilisateur.png" : userInformation && userInformation.image == null && userInformation.gender == 'female' ?
                                    '/src/images/user0.png' : userInformation && userInformation.image ? userInformation : "/src/images/utilisateur.png"
                            }
                            alt="Profile"
                            sx={{ width: 96, height: 96, border: '4px solid white' }}
                        />
                    </div>
                    <div>
                        <div className="pt-10 px-6 flex flex-row items-center gap-1">
                            <h2 className="text-xl font-semibold text-gray-800"> {userInformation.last_name + " " + userInformation.first_name} </h2>
                            {
                                userInformation && userInformation.role != 'user' && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={`${userInformation.role == 'admin' ? 'text-sky-700' : 'text-green-600'} icon icon-tabler icons-tabler-filled icon-tabler-rosette-discount-check`}><path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
                                </svg>
                            }
                        </div>
                        <div className="px-6">
                            <p className="text-md text-gray-400"> {userInformation.address ? userInformation.address : 'Addresse'}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 -mt-8">
                    {/* Informations personnelles  */}
                    <div className="bg-white rounded shadow p-6 h-[50vh] w-1/2">
                        <h4 className="text-lg font-semibold mb-4 text-slate-700 "> A propos  </h4>
                        <div className="grid grid-cols-1 gap-2">
                            {
                                userInformation && userInformation.public == false && <>
                                    {/* Date de naissance */}
                                    <div className="flex flex-row gap-2 items-center mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-cake">
                                            <title> Date de naissance </title>
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M3 20h18v-8a3 3 0 0 0 -3 -3h-12a3 3 0 0 0 -3 3v8z" />
                                            <path d="M3 14.803c.312 .135 .654 .204 1 .197a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1c.35 .007 .692 -.062 1 -.197" />
                                            <path d="M12 4l1.465 1.638a2 2 0 1 1 -3.015 .099l1.55 -1.737z" /></svg>
                                        <span> {userInformation.birth_date ? formatDate(userInformation.birth_date) : ' XX / XX /XXXX'} </span>
                                    </div>
                                    {/*birth place*/}
                                    <div className="flex flex-row gap-2 items-center mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-map-pin"><path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <title> Lieu de naissance </title>
                                            <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                                            <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
                                        </svg>
                                        <span> {userInformation.birth_place ? userInformation.birth_place : 'XXXXX--XXXX'}  </span>
                                    </div>
                                    {/* Situation Marital   */}
                                    <div className="flex flex-row gap-2 items-center mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-heart">
                                            <title> Situation matrimoniale </title>
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" />
                                        </svg>
                                        <span> {userInformation.marital_status ? userInformation.marital_status : 'xxxxxx'} </span>
                                    </div>

                                </>
                            }
                            {/*phone number */}
                            <div className="flex flex-row gap-2 items-center mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-phone">
                                    <title> Numéro de téléphone </title>
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                                </svg>
                                <span>  {userInformation.phone_number ? userInformation.phone_number : '(+261) 34 XX XXX XX'}</span>
                            </div>
                            {/* email  */}
                            <div className="flex flex-row gap-2 items-center mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-at"><path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <title> Adresse email </title>
                                    <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                                    <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28" />
                                </svg>
                                <span> {userInformation.email ? userInformation.email : '............@xxxx.com'} </span>
                            </div>

                            {/* Poste Occupé */}
                            <div className="flex flex-row gap-2 items-center mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-briefcase-2">
                                    <title> Poste occupé </title>
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M3 9a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9z" />
                                    <path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                                <span>  Informatique  </span>
                            </div>
                        </div>
                    </div>
                    <div className=" rounded  space-y-6 h-full flex flex-col justify-between w-full">
                        <div className="flex-grow space-y-6 mb-3 w-full">
                            <h4 className="text-xl font-semibold text-slate-800 border-b pb-2 bg-white p-3 rounded">
                                Publications récentes
                            </h4>
                        </div>
                        {/* grid grid-cols-1 md:grid-cols-1 */}
                        <div className="flex flex-col items-center justify-center gap-4">
                            {
                                userPosts && userPosts.map((post, index) => {
                                    return <Post data={post} key={index} />
                                })
                            }
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}