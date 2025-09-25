import { Alert, Box, Modal, TextareaAutosize, Typography } from "@mui/material";
import { useState } from "react";
import api from "../axios";

export default function Signaler({ open, onClose, userID }) {

    // état de formulaire
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState('')

    const SubmitReport = async (id) => {
        setLoading(true)

        if (!report) {
            setError('Motif manquant — veuillez le compléter pour continuer')
            setLoading(false)
            return;
        }

        api.post('/report-error', {
            errors: [{
                field: report
            }], user_id: id
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

    const cancel = () => {
        setError('')
        setSuccess('')
        setLoading(false)
        setReport('')
        onClose()
    }

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
                Signaler un problème
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

            <TextareaAutosize
                aria-label="minimum height"
                minRows={4}
                placeholder="Décrivez ici bas..."
                className="rounded w-full resize-none"
                value={report}
                onChange={(e) => {
                    setReport(e.target.value)
                }}
            />

            {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    {success}
                </Alert>
            )}
            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            <div className="flex flex-row gap-2 mt-3">
                <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 
                 text-white font-medium rounded-lg cursor-pointer w-full"
                    onClick={(e) => {
                        e.preventDefault()
                        SubmitReport(userID)
                    }}
                    aria-live="polite"
                >
                    {
                        loading == true ? 'Envoi en cours...' : 'Signaler'
                    }
                </button>
            </div>

        </Box>
    </Modal>
}