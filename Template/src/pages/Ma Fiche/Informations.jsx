import { Alert, AlertTitle, Avatar, Button, ListItemIcon, ListItemText, Menu, MenuItem, Switch } from "@mui/material";
import { CheckCircle, Edit, Warning } from '@mui/icons-material';
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import api from "../../components/axios";
import { PulseLoader } from "react-spinners";
import Signaler from "../../components/Mes Informations/Signaler";
import ProfileMale from "../../images/utilisateur.png";
import ProfileFemale from "../../images/user0.png"
export default function Informations() {
    const { user } = useContext(AppContext)
    const [userInformation, setUserInformation] = useState({})

    // retourne les data comme  clients/contract_type/departments/classification/managers 
    const [clients, setClients] = useState([])
    const [contract, setContract] = useState([])
    const [department, setDepartment] = useState([])
    const [positions, setPositions] = useState([])
    const [classification, setClassification] = useState([])
    const [managers, setManagers] = useState([])

    const [checked, setChecked] = useState(false);
    // report 
    const [loading, setLoading] = useState(false)

    const [open, setOpen] = useState(false)
    const [pulseLoader, setPulseLoader] = useState(false)


    const [anchorEl, setAnchorEl] = useState(null);

    const isOpen = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget); // save the button element
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        api.get("/data")
            .then((response) => {
                setClients(response.data.clients)
                setContract(response.data.contract_types)
                setPositions(response.data.positions)
                setDepartment(response.data.departments)
                setClassification(response.data.classifications)
                setManagers(response.data.managers)
            })
            .catch((error) => {
                alert(error.response.message)
            })
    }, []);

    const getValueFromId = (object, id) => {
        return object[id] || null;
    };


    const classificationId = getValueFromId(classification, userInformation.classification_id);
    const departmentId = getValueFromId(department, userInformation.department);
    const positionId = getValueFromId(positions, userInformation.position_id);

    useEffect(() => {
        setPulseLoader(true)
        api.get('/user/' + user.id + '/info')
            .then((response) => {
                setPulseLoader(false)
                setUserInformation(response.data.user)
                setChecked(response.data.user.public)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [user])



    const ToggleStatus = async (id, state) => {
        try {
            await api.put(`/users/${id}/activateInformation`, {
                public: state,
            });
            console.log("Status updated:", state);
            window.location.reload()
        } catch (error) {
            console.error("Error updating status:", error);
            setChecked((prev) => !prev);
        }
    };

    const handleChange = (event) => {
        const newState = event.target.checked;
        setChecked(newState);
        ToggleStatus(user.id, newState);
    }

    const formatDate = (d) => {
        const date = new Date(d);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };


    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-6xl mx-auto">
            {
                pulseLoader == true ?
                    <PulseLoader
                        color={'#1a497f'}
                        loading={loading}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    ></PulseLoader>
                    : <>
                        {/* Profile Info */}
                        <div className="pt-3 px-6 pb-6">
                            {/* className="absolute left-6 bottom-[-40px]" */}
                            <div className="flex items-center gap-2 flex-row w-full">
                                <div className="flex items-center gap-2 flex-row w-full">
                                    <Avatar
                                        src={
                                            userInformation && userInformation.image ? userInformation.image : userInformation.gender == 'male' ?
                                                ProfileMale : ProfileFemale
                                        }  
                                        alt="Profile"
                                        sx={{ width: 96, height: 96, border: '4px solid white' }}
                                    />
                                    <div className="flex items-center justify-start heading-5 flex-col">
                                        <h2 className="text-xl font-semibold text-gray-800"> {userInformation.last_name + " " + userInformation.first_name} </h2>
                                        <p className="text-md text-gray-400"> {userInformation.address ? userInformation.address + ", Madagascar" : 'Addresse'}</p>
                                    </div>
                                </div>
                                <div>
                                    <button className="cursor-pointer bg-gray-50 p-1 rounded" onClick={handleClick}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-dots">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                            <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                            <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-2 ">
                                <label htmlFor="public"> Privé </label>
                                <Switch
                                    checked={checked}
                                    onChange={handleChange}
                                    slotProps={{ input: { 'aria-label': 'controlled' } }}
                                    id="public"
                                />
                                <label htmlFor="public"> Public </label>
                            </div>
                            <div>
                                {
                                    userInformation && userInformation.public == true && <Alert severity="info">
                                        Votre compte est désormais public. Tous les utilisateurs peuvent désormais accéder à vos informations personnelles visibles en ligne.
                                    </Alert>
                                }
                            </div>
                        </div>

                        {/* Infos */}
                        <div className="px-6 pb-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Personnelles */}
                                <div className="border rounded-lg p-4 bg-gray-50 gap-2">
                                    <div className="flex items-center gap-2 mb-3">
                                        <h4 className="font-semibold text-gray-800"> Informations personnelles </h4>
                                    </div>
                                    {/*birthdate*/}
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

                                    {/* Situation Marital   */}
                                    <div className="flex flex-row gap-2 items-center mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-heart">
                                            <title> Situation matrimoniale </title>
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" />
                                        </svg>
                                        <span> {userInformation.marital_status ? userInformation.marital_status : 'xxxxxx'} </span>
                                    </div>
                                </div>


                                {/* Professionnelles */}
                                <div className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center gap-2 mb-3">
                                        <h4 className="font-semibold text-gray-800">Informations professionnelles </h4>
                                    </div>
                                    {/* Manager */}
                                    <div className="flex flex-row gap-2 items-center mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="tetx-sky-600 icon icon-tabler icons-tabler-outline icon-tabler-user-shield">
                                            <title> Manager </title>
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M6 21v-2a4 4 0 0 1 4 -4h2" />
                                            <path d="M22 16c0 4 -2.5 6 -3.5 6s-3.5 -2 -3.5 -6c1 0 2.5 -.5 3.5 -1.5c1 1 2.5 1.5 3.5 1.5z" />
                                            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                        </svg>

                                        <span>  {userInformation.manager} <CheckCircle className="text-blue-500" fontSize="small" />   </span>
                                    </div>

                                    {/* type de Contrats */}
                                    <div className="flex flex-row gap-2 items-center mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-contract">
                                            <title> Contrat </title>
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M8 21h-2a3 3 0 0 1 -3 -3v-1h5.5" />
                                            <path d="M17 8.5v-3.5a2 2 0 1 1 2 2h-2" />
                                            <path d="M19 3h-11a3 3 0 0 0 -3 3v11" />
                                            <path d="M9 7h4" />
                                            <path d="M9 11h4" /><path d="M18.42 12.61a2.1 2.1 0 0 1 2.97 2.97l-6.39 6.42h-3v-3z" />
                                        </svg>
                                        <span> {userInformation.contract_code ? userInformation.contract_code : 'XXX  '}  </span>
                                    </div>

                                    {/* Catégorie */}
                                    <div className="flex flex-row gap-2 items-center mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-category">
                                            <title> Classification </title>
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M4 4h6v6h-6z" />
                                            <path d="M14 4h6v6h-6z" />
                                            <path d="M4 14h6v6h-6z" />
                                            <path d="M17 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /></svg>
                                        <span> {classificationId}   </span>
                                    </div>

                                    {/* Poste Occupé */}
                                    <div className="flex flex-row gap-2 items-center mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-briefcase-2">
                                            <title> Poste occupé </title>
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M3 9a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9z" />
                                            <path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                        <span>  {positionId} </span>
                                    </div>
                                    {/* Matricule */}
                                    <div className="flex flex-row gap-2 items-center mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-id"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 4m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
                                            <title> Numéro Matricule </title>
                                            <path d="M9 10m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                                            <path d="M15 8l2 0" /><path d="M15 12l2 0" />
                                            <path d="M7 16l10 0" />
                                        </svg>
                                        <span> {userInformation.employee_number ? userInformation.employee_number : 'XXXX '}  </span>
                                    </div>

                                    {/* Cnaps */}
                                    <div className="flex flex-row gap-2 items-center mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-number"><path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <title> Numéro Cnaps </title>
                                            <path d="M4 17v-10l7 10v-10" />
                                            <path d="M15 17h5" />
                                            <path d="M17.5 10m-2.5 0a2.5 3 0 1 0 5 0a2.5 3 0 1 0 -5 0" />
                                        </svg>
                                        <span> Cnaps  {userInformation.cnaps_number ? userInformation.cnaps_number : 'XXXXXXXXXXX '} </span>
                                    </div>
                                    {/* Date d'embauche */}
                                    <div className="flex flex-row gap-2 items-center mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-calendar-event"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M16 2a1 1 0 0 1 .993 .883l.007 .117v1h1a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-12a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h1v-1a1 1 0 0 1 1.993 -.117l.007 .117v1h6v-1a1 1 0 0 1 1 -1m3 7h-14v9.625c0 .705 .386 1.286 .883 1.366l.117 .009h12c.513 0 .936 -.53 .993 -1.215l.007 -.16z" />
                                            <title> Date d'embauche </title>
                                            <path d="M8 14h2v2h-2z" />
                                        </svg>
                                        <span> {userInformation.hire_date ? formatDate(userInformation.hire_date) : 'XX / XX / XXXX '}   </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Signaler open={open} onClose={() => {
                            setOpen(false)
                        }} userID={user.id} />
                        <>
                            <Menu
                                anchorEl={anchorEl}
                                open={isOpen}
                                onClose={handleClose}
                                PaperProps={{
                                    elevation: 1,
                                    sx: {
                                        mt: 1,
                                        borderRadius: 2,
                                        minWidth: 150,
                                    },
                                }}
                            >
                                <MenuItem
                                    onClick={() => {
                                        handleClose()
                                        setOpen(true)
                                    }}
                                >
                                    <ListItemIcon>
                                        <Warning fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Signaler" />
                                </MenuItem>
                            </Menu>
                        </>
                    </>
            }
        </div >
    );
}
