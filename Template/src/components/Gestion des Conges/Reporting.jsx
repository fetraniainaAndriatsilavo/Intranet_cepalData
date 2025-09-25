import { Alert, Box, Modal, TextareaAutosize, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import api from "../axios";
import { AppContext } from "../../context/AppContext";
import { data } from "react-router-dom";

export default function Reporting({ open, onClose, infos, fetchDemandes }) {
    const { user } = useContext(AppContext)

    const [report, setReport] = useState({
        user_id: infos ? infos.user_id : 0,
        content: '',
        loading: false,
        loading_error: false,
        error: '',
        success: '',
    })

    const RefusedStatus = (id) => {

        if (!report.content) {
            setReport({
                user_id: infos ? infos.user_id : 0,
                content: '',
                success: '',
                loading: false,
                error: 'Motif manquant — veuillez le compléter pour continuer'
            })
            return;
        }

        setReport({
            user_id: infos ? infos.user_id : 0,
            content: '',
            success: '',
            loading: false,
            loading_error: true,
            error: ''
        })


        api.post(`/leave-requests/${id}/reject`, {
            approved_comment: report.content,
            approved_by: user.id
        })
            .then((response) => {
                setReport({
                    user_id: infos.user_id,
                    content: '',
                    success: response.data.message,
                    loading: false,
                    loading_error: false,
                    error: ''
                })
                onClose()
                fetchDemandes();
            })
            .catch((error) => {
                setReport({
                    user_id: infos ? infos.user_id : 0,
                    content: '',
                    success: error.response.data.message,
                    loading: false,
                    loading_error: false,
                    error: ''
                })
            })
            .finally(() => {
                setReport({
                    user_id: infos ? infos.user_id : 0,
                    content: '',
                    loading: false,
                    loading_error: false,
                    error: '',
                    success: '',
                })
            });
    };

    const ApproveStatus = (id) => {
        setReport({
            user_id: infos ? infos.user_id : 0,
            content: '',
            success: '',
            loading: true,
            loading_error: false,
            error: ''
        })

        api.post(`/leave-requests/${id}/approve`, {
            approved_comment: report.content,
            approved_by: user.id
        })
            .then((response) => {
                setReport({
                    user_id: infos.user_id,
                    content: '',
                    success: response.data.message,
                    loading: false,
                    loading_error: false,
                    error: ''
                })
                onClose()
                fetchDemandes();
            })
            .catch((error) => {
                setReport({
                    user_id: infos ? infos.user_id : 0,
                    content: '',
                    success: error.response.data.message,
                    loading: false,
                    loading_error: false,
                    error: ''
                })
            })
            .finally(() => {
                setReport({
                    user_id: infos ? infos.user_id : 0,
                    content: '',
                    loading: false,
                    loading_error: false,
                    error: '',
                    success: '',
                })
            });
    };

    const cancel = () => {
        setReport({
            user_id: infos ? infos.user_id : 0,
            content: '',
            loading: false,
            loading_error: false,
            error: '',
            success: '',
        })
        onClose()
    }



    const formatDate = (d) => {
        const date = new Date(d);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const excludedPermission = [
        'Congé payé',
        'Congé sans solde',
        "Hospitalisation d'un enfant",
        "Hospitalisation de conjoint",
        "Mises à pieds"
    ];

    const AutreTypes = [
        "Hospitalisation d'un enfant",
        "Hospitalisation de conjoint",
        "Mises à pieds"
    ]

    const CongeType = [
        'Congé payé',
        'Congé sans solde'
    ]


    return <Modal open={open} onClose={cancel}>
        <Box
            sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                borderRadius: 1,
                boxShadow: 24,
                p: 2,
            }}
        >
            <Typography
                variant="h6"
                gutterBottom
                sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                Validation de la demande
                <button
                    onClick={cancel}
                    style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        marginLeft: "auto",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-x">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M18 6l-12 12" />
                        <path d="M6 6l12 12" />
                    </svg>

                </button>
            </Typography>
            <div className="flex flex-col gap-2 mb-2">
                <div>
                    <p> Nom : <span className="font-semibold"> {infos ? infos.user.last_name + ' ' + infos.user.first_name : ''}  </span> </p>
                </ div>
                <div>
                    <p> Motif : <span className="font-semibold"> {infos ? infos.leave_type.name : ''}  </span> </p>
                </div>
                <div>
                    <p> Date de début : <span className="font-semibold">  {infos ? formatDate(infos.start_date) : ''} </span> </p>
                </div>
                <div>
                    <p> Date de fin : <span className="font-semibold">  {infos ? formatDate(infos.end_date) : ''}  </span> </p>
                </div>
                <div>
                    <p> Nombre de jours <span className="font-semibold"> {infos ? infos.number_day : ''} jour(s)  </span> </p>
                </div>
                <div>
                    <p> Solde restants : <span className="font-semibold">{
                        infos
                            ? CongeType.includes(infos.leave_type?.name)
                                ? infos.user?.ogc_leav_bal ?? 0
                                : !excludedPermission.includes(infos.leave_type?.name)
                                    ? infos.user?.ogc_perm_bal ?? 0
                                    : infos.user?.ogc_othr_bal ?? 0
                            : ''
                    }
                    </span> </p>
                </div>
            </div>
            <div className="mb-2">
                <p className="text-center">
                    Pièce jointe :{" "} 
                    {infos?.support_file_path ? (
                        <a
                            href={infos.support_file_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-600 underline"
                        >
                            {infos.support_file_path.split("/").pop()}
                        </a>
                    ) : (
                        "Aucune pièce jointe"
                    )}
                </p>
            </div> 
            <TextareaAutosize
                aria-label="minimum height"
                minRows={4}
                placeholder="Commentaire..."
                className="rounded w-full resize-none bg-gray-50 border-none"
                value={report.content}
                onChange={(e) => {
                    setReport((prev) => ({ ...prev, content: e.target.value }))
                }}
            />

            {report.success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    {report.success}
                </Alert>
            )}
            {report.error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {report.error}
                </Alert>
            )}

            <div className="flex flex-row gap-2 mt-3">
                <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 
                 text-white font-medium rounded-lg cursor-pointer w-full"
                    onClick={(e) => {
                        e.preventDefault()
                        RefusedStatus(infos ? infos.id : 0)
                    }}
                    aria-live="polite"
                >
                    {
                        report.loading == false && report.loading_error == true ? 'Traitement...' : 'Refuser'
                    }
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 
                 text-white font-medium rounded-lg cursor-pointer w-full"
                    onClick={(e) => {
                        e.preventDefault()
                        ApproveStatus(infos ? infos.id : 0)
                    }}
                    aria-live="polite"
                >
                    {
                        report.loading == true && report.loading_error == false ? 'Validation ...' : 'Valider'
                    }
                </button>
            </div>
        </Box>
    </Modal>
}