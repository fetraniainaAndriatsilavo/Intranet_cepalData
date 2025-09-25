import { Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Pagination, Slide, Snackbar } from "@mui/material";
import api from "../../components/axios";
import Table from "../../components/Conges/Table";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { PulseLoader } from "react-spinners";

export default function MesDemandes() {
    const { user } = useContext(AppContext)

    const listMenu = [
        "Solde ",
        "Motif",
        "Date de début",
        "Date de fin",
        "Nombre de jours",
        "Date de soumission",
        "Action / status"
    ];

    const [loading, setLoading] = useState(false)

    // listes des demandes a valider 
    const [demandes, setDemandes] = useState([])

    const fetchDemandesUtilisateur = (id) => {
        setLoading(true)
        api.get('/users/' + id + '/leave-requests')
            .then((response) => {
                setDemandes(response.data);
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                setLoading(false)
            })
    };

    // pagination 
    const [currentPage, setCurrentPage] = useState(1);
    const userPerPage = 10;
    const lastPageIndex = Math.ceil(demandes.length / userPerPage);
    const [currentView, setCurrentView] = useState([])

    const handleChange = (event, value) => {
        setCurrentPage(value);
        setCurrentView(demandes.slice((value * userPerPage) - 10, value * userPerPage))
    };

    // Snackbar 
    const [open, setOpen] = useState(false)

    const handleClose = (
        event,
        reason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    // filtre par nom, prénom d'utilisateur
    const [searchUsers, setSearchUsers] = useState("");

    const filteredUsers = demandes.filter((demande) => {
        const firstName = demande.user?.first_name?.toLowerCase() || "";
        const lastName = demande.user?.last_name?.toLowerCase() || "";
        return (
            firstName.includes(searchUsers.toLowerCase()) ||
            lastName.includes(searchUsers.toLowerCase())
        );
    });

    // pagination pour filtered users
    const lastFilteredPageIndex = Math.ceil(filteredUsers.length / userPerPage);
    const filteredView = filteredUsers.slice((currentPage - 1) * userPerPage, currentPage * userPerPage);

    // choisir laquelle  utilisateurs 
    const displayedUsers = searchUsers
        ? filteredView
        : currentView.length < 1
            ? demandes.slice(0, 10)
            : currentView;

    // reinitialise apres une validation 
    useEffect(() => {
        fetchDemandesUtilisateur(user.id)
    }, [])

    const [message, setMessage] = useState({
        type: '',
        content: ''
    })

    useEffect(() => {
        setOpen(true)
    }, [message.content])


    // Modal 
    const [openDialog, setOpenDialog] = useState(false)

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    const handleClickOpenModal = () => {
        setOpenDialog(true);
    };

    const handleCloseModal = () => {
        setOpenDialog(false);
    };

    const [loadingModal, setLoadingModal] = useState(false)
    const [details, setDetails] = useState(null)

    const cancelDemandes = (id) => {
        setLoadingModal(true)
        api.post('/leave-requests/' + id + '/cancel', {}, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
         .then((response) => {
                fetchDemandesUtilisateur(user.id)
                handleCloseModal()
                setMessage({
                    type: 'success',
                    content: response.data.message
                })
            })
            .catch((error) => {
                setMessage({
                    type: 'error',
                    content: error.response.data.message
                })
                setOpen(true)
        })
        .finally(() => {
            setLoadingModal(false)
        })
    }


    return <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0 flex items-center justify-between w-full">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold"> Ma liste de demandes </h1>
        </div>
        {
            loading == true ? (
                <div className="flex items-center justify-center w-full h-full">
                    <PulseLoader
                        color={"#1a497f"}
                        loading={loading}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
            ) : <>
                <div className="bg-white  w-full rounded-lg">
                    <h3 className="p-3 "> <span className=" font-semibold text-gray-300"> {searchUsers ? filteredUsers.length : demandes ? demandes.length : 0}  </span> enregistrements </h3>
                    <Table datas={displayedUsers} listHeader={listMenu} type="annulation" setDetails={setDetails}
                        handleClickOpenModal={handleClickOpenModal}
                    />
                </div>
                <div>
                    <Pagination count={lastPageIndex} page={currentPage} onChange={handleChange} />
                </div>
            </>
        }
        {
            message.type == 'success' && <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="standard"
                    sx={{ width: '100%' }}
                >
                    {message.content}
                </Alert>
            </Snackbar>
        }

        {
            message.type == 'error' && <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="standard"
                    sx={{ width: '100%' }}
                >
                    {message.content}
                </Alert>
            </Snackbar>
        }
        {
            details && openDialog == true && <Dialog
                open={openDialog}
                // TransitionComponent={Transition} 
                keepMounted
                onClose={handleCloseModal}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Annulation"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Voulez-vous vraiment annuler votre demande d'absence ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button onClick={handleCloseModal} className="px-4 py-2 bg-white text-sky-600 rounded cursor-pointer">
                        Retour
                    </button>
                    <button className="px-4 py-2 bg-sky-600 text-white rounded cursor-pointer"
                        onClick={() => {
                            cancelDemandes(details.id)
                        }}
                    >
                        {loadingModal ? 'Traitement en cours...' : 'Poursuivre'}
                    </button>
                </DialogActions>
            </Dialog>
        }

    </div>
}