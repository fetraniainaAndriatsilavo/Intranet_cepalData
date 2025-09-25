import { Alert, Autocomplete, TextareaAutosize, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import api from "../../components/axios";
import { AppContext } from "../../context/AppContext";
import { se } from "date-fns/locale";

export default function Absence() {
    const { user } = useContext(AppContext)
    const [period, setPeriod] = useState({
        user_id: user ? user.id : 0,
        type: 'congés',
        leave_type_id: '',
        start_date: '',
        end_date: '',
        start_half_day: 'morning',
        end_half_day: 'morning',
        motif: '',
        support_file_path: '',
        availableDay: ''
    })

    const fileInputRef = useRef(null);

    const [selectedLeave, setSelectedLeave] = useState(null)

    const [reporting, setReporting] = useState({
        success: '',
        error: '',
        loading: false
    })

    const [leaveType, setLeaveType] = useState({
        permissionType: [],
        congeType: [],
        autresType: []
    })

    const [numberDay, setNumberDay] = useState(0);

    const typeOptions = [
        { label: 'Congés', value: 'congés' },
        { label: 'Permission', value: 'permission' },
        { label: 'Autres', value: 'autres' }
    ]

    const halfDayOptions = [
        { label: "Matin", value: "morning" },
        { label: "Après-midi", value: "afternoon" }
    ];

    // les types de permissions et autres
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

    function calculateWorkingDays({ start_date, end_date, start_half_day, end_half_day }) {
        if (!start_date || !end_date) return 0;

        const start = new Date(start_date);
        const end = new Date(end_date);
        let total = 0;

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const day = d.getDay();
            if (day !== 0 && day !== 6) {
                total += 1;
            }
        }
        if (start_half_day === "afternoon" && start.getDay() !== 0 && start.getDay() !== 6) {
            total -= 0.5;
        }
        if (end_half_day === "morning" && end.getDay() !== 0 && end.getDay() !== 6) {
            total -= 0.5;
        }
        return total;
    }

    function clear() {
        setPeriod({
            user_id: user ? user.id : 0,
            type: 'congés',
            leave_type_id: '',
            start_date: '',
            end_date: '',
            start_half_day: 'morning',
            end_half_day: 'morning',
            motif: '',
            support_file_path: '',
        })
        setReporting({
            loading: false,
            error: '',
            success: ''
        })

        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
        setSelectedLeave(null)
    }

    const fetchLeaveType = () => {
        api.get("/type/leave")
            .then((response) => {
                const data = response.data;
                if (user && user.gender == 'male') {
                    excludedPermission.push('Congé de maternité')
                } else if (user && user.gender == 'female') {
                    excludedPermission.push('Congé de paternité')
                }
                setLeaveType({
                    permissionType: data.filter((d) => !excludedPermission.includes(d.name)),
                    autresType: data.filter((d) => AutreTypes.includes(d.name)),
                    congeType: data.filter((d) => CongeType.includes(d.name)),
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const submit = async () => {
        if (!period.start_date) {
            setReporting({ success: "", error: "La date de début est requise", loading: false });
            return;
        } else if (!period.end_date) {
            setReporting({ success: "", error: "La date de fin est requise", loading: false });
            return;
        }

        if (new Date(period.start_date) > new Date(period.end_date)) {
            setPeriod((prev) => ({ ...prev, start_date: '' }))
            setPeriod((prev) => ({ ...prev, end_date: '' }))
            setReporting({ success: "", error: "La date de début doit être avant la date de fin", loading: false });
            return;
        }

        if (!period.leave_type_id) {
            setReporting({ success: "", error: "Le motif du congé est requis", loading: false });
            return;
        }

        if (period.type !== 'congés' && numberDay > period.availableDay) {
            setReporting({ success: "", error: "Vous devez respecter le nombre de jours autorisé.", loading: false });
            return;
        }

        if (selectedLeave && selectedLeave.need_proof == true && !period.support_file_path) {
            setReporting({ success: "", error: "Une pièce justificative est nécéssaire pour appuyer votre demande", loading: false });
            return;
        }

        setReporting({ success: "", error: "", loading: true });

        api.post('/leave-requests', period, {
            headers: { "Content-Type": "multipart/form-data" }
        })
            .then((response) => {
                setPeriod({
                    user_id: user ? user.id : 0,
                    type: 'congés',
                    leave_type_id: '',
                    start_date: '',
                    end_date: '',
                    start_half_day: 'morning',
                    end_half_day: 'morning',
                    motif: '',
                    availableDay: ''
                })
                setReporting({
                    success: response.data.message,
                    error: "",
                    loading: false,
                });
            })
            .catch((error) => {
                console.log(error)
                setReporting({
                    success: "",
                    error: error.response.data.message,
                    loading: false,
                });
            })
            .finally(() => {
                setReporting(prev => ({
                    ...prev,
                    loading: false
                }));
            })
    }

    useEffect(() => {
        fetchLeaveType()
    }, []);

    useEffect(() => {
        setNumberDay(calculateWorkingDays(period));
    }, [period]);

    return (
        <div className="bg-white rounded p-5 space-y-4">
            <div>
                <Autocomplete
                    disablePortal
                    options={typeOptions}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                        <TextField {...params} label="Type de demandes **" size="small" />
                    )}
                    value={typeOptions.find((opt) => opt.value === period.type) || null}
                    onChange={(_, newValue) => {
                        setPeriod((prev) => ({ ...prev, type: newValue?.value || "", availableDay: newValue?.nb_of_day || " " }));
                    }}
                />
            </div>
            <div>
                {
                    leaveType && period.type == 'congés' && <Autocomplete
                        disablePortal
                        options={leaveType.congeType}
                        getOptionLabel={(option) => option.name}
                        value={leaveType.congeType.find((opt) => opt.id === period.leave_type_id) || null}
                        onChange={(_, newValue) => {
                            setPeriod((prev) => ({ ...prev, leave_type_id: newValue?.id || "", availableDay: newValue?.nb_of_day || " " }));
                            setSelectedLeave(newValue)
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Motif **" size="small" />
                        )}
                    />
                }
                {
                    leaveType && period.type == 'permission' && <Autocomplete
                        disablePortal
                        options={leaveType.permissionType}
                        getOptionLabel={(option) =>
                            option.name +
                            (option.nb_of_day
                                ? ' -- ' + Number(option.nb_of_day) + ' ' + (Number(option.nb_of_day) > 1 ? 'jours' : 'jour')
                                : ''
                            )
                        }
                        value={leaveType.permissionType.find((opt) => opt.id === period.leave_type_id) || null}
                        onChange={(_, newValue) => {
                            setPeriod((prev) => ({ ...prev, leave_type_id: newValue?.id || "", availableDay: newValue?.nb_of_day || " " }));
                            console.log(newValue.id)
                            setSelectedLeave(newValue)
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Motif **" size="small" />
                        )}
                    />
                }
                {
                    leaveType && period.type == 'autres' && <Autocomplete
                        disablePortal
                        options={leaveType.autresType}
                        getOptionLabel={(option) =>
                            option.name +
                            (option.nb_of_day
                                ? ' -- ' + Number(option.nb_of_day) + ' ' + (Number(option.nb_of_day) > 1 ? 'jours' : 'jour')
                                : ''
                            )
                        }
                        value={leaveType.autresType.find((opt) => opt.id === period.leave_type_id) || null}
                        onChange={(_, newValue) => {
                            setPeriod((prev) => ({ ...prev, leave_type_id: newValue?.id || "", availableDay: newValue?.nb_of_day || " " }));
                            console.log(newValue.id)
                            setSelectedLeave(newValue)
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Motif **" size="small" />
                        )}
                    />
                }
            </div>
            <div className="flex flex-row gap-2 items-center">
                {/* <span> Date de début : </span>  */}
                <TextField
                    size="small"
                    type="date"
                    placeholder="Date de fin"
                    className="w-1/2"
                    value={period.start_date}
                    onChange={(e) =>
                        setPeriod((prev) => ({ ...prev, start_date: e.target.value }))
                    }
                />
                <Autocomplete
                    size="small"
                    disablePortal
                    options={halfDayOptions}
                    getOptionLabel={(option) => option.label}
                    value={halfDayOptions.find((opt) => opt.value === period.start_half_day) || null}
                    onChange={(_, newValue) =>
                        setPeriod((prev) => ({ ...prev, start_half_day: newValue?.value || "" }))
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="Horaire **" size="small" />
                    )}
                    className="w-1/2"
                />
            </div>
            <div className="flex flex-row gap-2 items-center text-justify">
                {/* <span className="mr-4"> Date de fin : </span>  */}
                <TextField
                    size="small"
                    type="date"
                    placeholder="Date de fin"
                    className="w-1/2"
                    value={period.end_date}
                    onChange={(e) =>
                        setPeriod((prev) => ({ ...prev, end_date: e.target.value }))
                    }
                />
                <Autocomplete
                    size="small"
                    disablePortal
                    options={halfDayOptions}
                    getOptionLabel={(option) => option.label}
                    value={halfDayOptions.find((opt) => opt.value === period.end_half_day) || null}
                    onChange={(_, newValue) =>
                        setPeriod((prev) => ({ ...prev, end_half_day: newValue?.value || "" }))
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="Horaire **" size="small" />
                    )}
                    className="w-1/2"
                />
            </div>

            <div>
                <p> Nombre de jours : <span className={`${(period.type !== 'congés' && numberDay > period.availableDay) ? 'text-red-400' : ''} font-semibold`}> {numberDay}
                    {
                        period.type !== 'congés' && <span className="font-semibold text-gray-500"> / {period.type !== 'congés' && Number(period.availableDay || "")} jour(s) de droit </span>
                    }
                </span>
                </p>
            </div>
            {
                selectedLeave && selectedLeave.need_proof == true && <div className="mt-3">
                    <input ref={fileInputRef} class="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50 p-2 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            setPeriod((prev) => ({
                                ...prev,
                                support_file_path: file || "",
                            }));
                        }}
                    />
                </div>
            }
            <div>
                <TextareaAutosize
                    aria-label="minimum height"
                    minRows={3}
                    className="w-full rounded bg-gray-50 border-0 resize-none"
                    placeholder="Expliquez votre demande en quelques mots"
                    value={period.motif}
                    onChange={(e) =>
                        setPeriod((prev) => ({ ...prev, motif: e.target.value }))
                    }
                />
            </div>

            <div>
                {
                    reporting.error && <Alert severity="error"> {reporting.error} </Alert>
                }
                {
                    reporting.success && <Alert severity="success">{reporting.success}</Alert>
                }
            </div>

            <div className="flex justify-start mt-4 gap-3 w-full">
                <button
                    className="px-3 py-2 border border-sky-600 text-sky-600 rounded cursor-pointer w-1/3"
                    type="reset"
                    onClick={() => {
                        clear()
                    }}
                >
                    Réinitialiser
                </button>
                <button
                    className="px-3 py-2 bg-sky-600 text-white rounded  cursor-pointer w-2/3"
                    onClick={() => {
                        submit()
                    }}
                >
                    {
                        reporting.loading == true ? 'Envoi en cours...' : 'Envoyer'
                    }
                </button>
            </div>
        </div>
    )
}