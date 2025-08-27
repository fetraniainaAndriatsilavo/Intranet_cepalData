import { Alert, AlertTitle, Avatar, Button } from "@mui/material";
import { CheckCircle } from '@mui/icons-material';
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import api from "../../components/axios";

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


    // report 
    const [report, setReport] = useState('')
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const SubmitReport = async () => {
        setLoading(true)
        api.post('/report-error', {
            errors: [{
                field: report
            }], user_id: user.id
        }, {
            headers: {
                "Content-Type": 'application/json'
            }
        })
            .then((response) => {
                setSuccess('Votre signalement a bien été transmis à l’équipe administrative.')
                window.location.reload()
            })
            .catch((error) => {
                setError(error.response.data.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }


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
        api.get('/user/' + user.id + '/info')
            .then((response) => {
                setUserInformation(response.data.user)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [user])

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-6xl mx-auto">
            {/* Cover Image */}
            <div className="h-52 w-full bg-cover bg-center relative" style={{ backgroundImage: "url('/src/images/360_F_467961418_UnS1ZAwAqbvVVMKExxqUNi0MUFTEJI83.jpg')" }}>
                <div className="absolute left-6 bottom-[-40px]">
                    <Avatar
                        src={userInformation && userInformation.image == null && userInformation.gender == 'male' ?
                            "/src/images/utilisateur.png" : userInformation && userInformation.image == null && userInformation.gender == 'female' ?
                                '/src/images/user0.png' : userInformation && userInformation.image ? userInformation : "/src/images/utilisateur.png"
                        }
                        alt="Profile"
                        sx={{ width: 96, height: 96, border: '4px solid white' }}
                    />
                </div>
            </div>

            {/* Profile Info */}
            <div className="pt-16 px-6 pb-6">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-gray-800"> {userInformation.first_name} </h2>
                </div>
                <p className="text-sm text-gray-500">
                    {departmentId}
                </p>
                <p className="text-md text-gray-400"> {userInformation.address ? userInformation.address + ", Madagascar" : 'Addresse'}</p>
            </div>

            {/* Infos */}
            <div className="px-6 pb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4"> Mes Informations </h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Personnelles */}
                    <div className="border rounded-lg p-4 bg-gray-50 gap-2">
                        <div className="flex items-center gap-2 mb-3">
                            <h4 className="font-semibold text-gray-800"> Personnelles </h4>
                        </div>
                        {/*birthdate*/}
                        <div className="flex flex-row gap-2 items-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-certificate"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M15 15m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M13 17.5v4.5l2 -1.5l2 1.5v-4.5" /><path d="M10 19h-5a2 2 0 0 1 -2 -2v-10c0 -1.1 .9 -2 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -1 1.73" />
                                <path d="M6 9l12 0" />
                                <path d="M6 12l3 0" />
                                <path d="M6 15l2 0" />
                            </svg>
                            <span> {userInformation.birth_date ? userInformation.birth_date : ' XX / XX /XXXX'} </span>
                        </div>

                        {/*birth place*/}
                        <div className="flex flex-row gap-2 items-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-map-pin"><path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                                <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
                            </svg>
                            <span> {userInformation.birth_place ? userInformation.birth_place : 'XXXXX--XXXX'}  </span>
                        </div>

                        {/*phone number */}
                        <div className="flex flex-row gap-2 items-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-phone">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                            </svg>
                            <span>  {userInformation.phone_number ? userInformation.phone_number : '(+261) 34 XX XXX XX'}</span>
                        </div>

                        {/* email  */}
                        <div className="flex flex-row gap-2 items-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-at"><path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                                <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28" />
                            </svg>
                            <span> {userInformation.email ? userInformation.email : '............@xxxx.com'} </span>
                        </div> 
                        
                        {/* Situation Marital   */}
                        <div className="flex flex-row gap-2 items-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-heart">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" />
                            </svg>
                            <span> {userInformation.marital_status ? userInformation.marital_status : 'xxxxxx'} </span>
                        </div>
                    </div>


                    {/* Professionnelles */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center gap-2 mb-3">
                            <h4 className="font-semibold text-gray-800"> Professionnelles </h4>
                        </div>
                        {/* Manager */}
                        <div className="flex flex-row gap-2 items-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-user-cog">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                <path d="M6 21v-2a4 4 0 0 1 4 -4h2.5" />
                                <path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                                <path d="M19.001 15.5v1.5" /><path d="M19.001 21v1.5" />
                                <path d="M22.032 17.25l-1.299 .75" />
                                <path d="M17.27 20l-1.3 .75" />
                                <path d="M15.97 17.25l1.3 .75" />
                                <path d="M20.733 20l1.3 .75" /></svg>

                            <span>  {userInformation.manager} <CheckCircle className="text-blue-500" fontSize="small" />   </span>
                        </div>

                        {/* type de Contrats */}
                        <div className="flex flex-row gap-2 items-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-contract">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M8 21h-2a3 3 0 0 1 -3 -3v-1h5.5" />
                                <path d="M17 8.5v-3.5a2 2 0 1 1 2 2h-2" />
                                <path d="M19 3h-11a3 3 0 0 0 -3 3v11" />
                                <path d="M9 7h4" />
                                <path d="M9 11h4" /><path d="M18.42 12.61a2.1 2.1 0 0 1 2.97 2.97l-6.39 6.42h-3v-3z" />
                            </svg>
                            <span> {userInformation.type ? userInformation.type : 'XXX (type de Contrats) '}  </span>
                        </div>

                        {/* Catégorie */}
                        <div className="flex flex-row gap-2 items-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-category">
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
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M3 9a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9z" />
                                <path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            <span>  {positionId} </span>
                        </div>
                        {/* Matricule */}
                        <div className="flex flex-row gap-2 items-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-id"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 4m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
                                <path d="M9 10m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                                <path d="M15 8l2 0" /><path d="M15 12l2 0" />
                                <path d="M7 16l10 0" />
                            </svg>
                            <span> {userInformation.employee_number ? userInformation.employee_number : 'XXXX '}  </span>
                        </div>

                        {/* Cnaps */}
                        <div className="flex flex-row gap-2 items-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-number"><path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M4 17v-10l7 10v-10" />
                                <path d="M15 17h5" />
                                <path d="M17.5 10m-2.5 0a2.5 3 0 1 0 5 0a2.5 3 0 1 0 -5 0" />
                            </svg>
                            <span> {userInformation.cnaps_number ? userInformation.cnaps_number : 'XXXXXXXXXXX '} </span>
                        </div>
                        {/* Date d'embauche */}
                        <div className="flex flex-row gap-2 items-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-calendar-event"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M16 2a1 1 0 0 1 .993 .883l.007 .117v1h1a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-12a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h1v-1a1 1 0 0 1 1.993 -.117l.007 .117v1h6v-1a1 1 0 0 1 1 -1m3 7h-14v9.625c0 .705 .386 1.286 .883 1.366l.117 .009h12c.513 0 .936 -.53 .993 -1.215l.007 -.16z" />
                                <path d="M8 14h2v2h-2z" />
                            </svg>
                            <span> {userInformation.hire_date ? userInformation.hire_date : 'XX / XX / XXXX (Date d\'embauche)'}  </span>
                        </div>
                    </div>
                </div>
            </div>


            <div className="px-6 pb-6 flex flex-col gap-3">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Signaler un problème
                </h3>

                <form className="flex flex-col gap-3">
                    {/* <label htmlFor="report" className="text-sm font-medium text-gray-700">
                        Décrivez vos problèmes
                    </label> */}
                    <textarea
                        id="report"
                        name="report"
                        rows={3}
                        className="rounded-lg bg-gray-50 focus:bg-gray-100 border border-gray-300 p-2"
                        placeholder="Décrivez vos problèmes ici ..."
                        value={report}
                        onChange={(e) => {
                            setReport(e.target.value)
                        }}
                        required
                    ></textarea>

                    <button
                        type="submit"
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 
                 text-white font-medium rounded-lg cursor-pointer w-fit"
                        onClick={(e) => {
                            e.preventDefault()
                            SubmitReport()
                        }}
                        aria-live="polite"
                    >
                        {
                            loading == true ? 'Envoi du signalement en cours...' : 'Signaler'
                        }
                    </button>
                    <div>
                        {
                            success && <Alert severity="success">
                                <AlertTitle> Succès </AlertTitle>
                                {success}
                            </Alert>
                        }

                        {
                            error && <Alert severity="error">
                                <AlertTitle> Erreur </AlertTitle>
                                {error}
                            </Alert>
                        }
                    </div>
                </form>
            </div>


            {/*  Mes Documents Administratifs */}
            {/* <div className="px-6 pb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">  Mes Documents Administratifs </h2>
                <div className="grid md:grid-row-1 gap-4"> */}
            {/* Resume Télécharger Section */}
            {/* <div className="px-6 pb-6">
                        <div className="flex flex-col md:flex-row gap-4"> */}
            {/* Resume Card */}
            {/* <div className="flex items-center justify-between border rounded-lg p-4 bg-white shadow-sm w-full md:w-1/2">
                                <div className="flex items-center gap-3">
                                    <img src="https://cdn-icons-png.flaticon.com/512/337/337946.png" alt="Resume" className="h-10 w-10" />
                                    <div>
                                        <p className="font-medium text-gray-800">Resume.pdf</p>
                                        <p className="text-sm text-gray-500">Updated 2 months ago</p>
                                    </div>
                                </div> */}
            {/* <a
                                    href="/documents/resume.pdf" // Replace with your actual file path
                                    download
                                    className="text-blue-600 hover:underline text-sm font-medium"
                                > */}
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-circle-arrow-down">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                                        <path d="M8 12l4 4" />
                                        <path d="M12 8v8" />
                                        <path d="M16 12l-4 4" />
                                    </svg>
                                </a>
                            </div> */}

            {/* National ID Card */}
            {/* <div className="flex items-center justify-between border rounded-lg p-4 bg-white shadow-sm w-full md:w-1/2">
                                <div className="flex items-center gap-3">
                                    <img src="https://cdn-icons-png.flaticon.com/512/942/942748.png" alt="ID Card" className="h-10 w-10" />
                                    <div>
                                        <p className="font-medium text-gray-800">CIN</p>
                                        <p className="text-sm text-gray-500">Issued in 2023</p>
                                    </div>
                                </div>
                                <a
                                    href="/documents/national_id.jpg" // Replace with your actual file path
                                    download
                                    className="text-blue-600 hover:underline text-sm font-medium"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-circle-arrow-down">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                                        <path d="M8 12l4 4" />
                                        <path d="M12 8v8" />
                                        <path d="M16 12l-4 4" />
                                    </svg>
                                </a>
                            </div> */}

            {/* </div>
                    </div>
                </div>
            </div> */}

            {/*  Mes Rémunérations */}
            {/* <div className="px-6 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4"> Mes Rémunérations </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> */}

            {/* Fiche Janvier */}
            {/* <div className="flex justify-between items-center p-4 border rounded-lg bg-gray-50 shadow-sm">
                        <div className="flex items-center gap-3">
                            <img src="https://cdn-icons-png.flaticon.com/512/337/337946.png" alt="PDF" className="h-8 w-8" />
                            <div>
                                <p className="text-sm font-medium text-gray-800">Fiche de paie</p>
                                <p className="text-xs text-gray-500"> Avril 2025 </p>
                            </div>
                        </div> */}
            {/* <a
                            href="/documents/paye_janvier.pdf"
                            download
                            className="text-blue-600 text-sm hover:underline"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-circle-arrow-down">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                                <path d="M8 12l4 4" />
                                <path d="M12 8v8" />
                                <path d="M16 12l-4 4" />
                            </svg>
                        </a>
                    </div> */}

            {/* Fiche Février */}
            {/* <div className="flex justify-between items-center p-4 border rounded-lg bg-gray-50 shadow-sm">
                        <div className="flex items-center gap-3">
                            <img src="https://cdn-icons-png.flaticon.com/512/337/337946.png" alt="PDF" className="h-8 w-8" />
                            <div>
                                <p className="text-sm font-medium text-gray-800">Fiche de paie</p>
                                <p className="text-xs text-gray-500"> Mai 2025 </p>
                            </div>
                        </div>
                        <a
                            href="/documents/paye_fevrier.pdf"
                            download
                            className="text-blue-600 text-sm hover:underline"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-circle-arrow-down">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                                <path d="M8 12l4 4" />
                                <path d="M12 8v8" />
                                <path d="M16 12l-4 4" />
                            </svg>
                        </a>
                    </div> */}

            {/* Fiche Mars (exemple avec badge "Nouveau") */}
            {/* <div className="flex justify-between items-center p-4 border rounded-lg bg-gray-50 shadow-sm">
                        <div className="flex items-center gap-3">
                            <img src="https://cdn-icons-png.flaticon.com/512/337/337946.png" alt="PDF" className="h-8 w-8" />
                            <div>
                                <p className="text-sm font-medium text-gray-800 flex items-center gap-1">
                                    Fiche de paie <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">Nouveau</span>
                                </p>
                                <p className="text-xs text-gray-500"> Juin 2025 </p>
                            </div>
                        </div>
                        <a
                            href="/documents/paye_mars.pdf"
                            download
                            className="text-blue-600 text-sm hover:underline"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-circle-arrow-down">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                                <path d="M8 12l4 4" />
                                <path d="M12 8v8" />
                                <path d="M16 12l-4 4" />
                            </svg>
                        </a>
                    </div> */}

            {/* </div>
            </div> */}
        </div >
    );
}
