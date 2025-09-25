import { useContext, useEffect, useState } from "react";
import TableFiche from "../../components/Ma Fiche/TableFiche";
import { AppContext } from "../../context/AppContext";
import api from "../../components/axios";
import { PulseLoader } from "react-spinners";

export default function MesDocuments() {
    const { user } = useContext(AppContext)
    const headers = [
        'Nom du fichier',
        'Type',
        'Importé par',
        'Date',
        'Action'
    ];

    const [Documents, setDocuments] = useState({
        public: [],
        private: [],
    })

    const [loading, setLoading] = useState(false)

    const fetchUserDocuments = (id) => {
        setLoading(true)
        api.get('/documents/user/' + id)
            .then((response) => {
                const data = response.data
                setDocuments({
                    public: data.public,
                    private: data.privee
                })
            })
            .catch((error) => {
                console.log(error.response.data.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchUserDocuments(user.id)
    }, [user.id])

    return <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">

        {
            loading == true ?
                (<div className="flex items-center justify-center w-full h-full">
                    <PulseLoader
                        color={"#1a497f"}
                        loading={loading}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>) : (
                    <>
                        <div className="mb-4 sm:mb-0 flex items-center justify-between w-full">
                            <h3 className="text-lg md:text-xl text-gray-800 dark:text-gray-100 font-bold">
                                Mes Documents
                            </h3>
                        </div>
                        <div className="bg-white w-full rounded-lg">
                            <h3 className="p-3">
                                <span className="text-gray-400 font-semibold">
                                    {Documents.private.length || 0}
                                </span>
                                &nbsp;{Documents.private.length > 1 ? 'fichiers' : 'fichier'}
                            </h3>
                            <TableFiche listHeader={headers || []} datas={Documents.private || []} />
                        </div>

                        <div className="mb-4 sm:mb-0 flex items-center justify-between w-full">
                            <h3 className="text-lg md:text-xl text-gray-800 dark:text-gray-100 font-bold">
                                Documents publics
                            </h3>
                        </div>
                        <div className="bg-white w-full rounded-lg">
                            <h3 className="p-3">
                                <span className="text-gray-400 font-semibold">
                                    {Documents.public.length || 0}
                                </span>
                                &nbsp;{Documents.public.length > 1 ? 'fichiers' : 'fichier'}
                            </h3>
                            <TableFiche listHeader={headers || []} datas={Documents.public || []} />
                        </div>
                    </>
                )
        }

    </div>
}