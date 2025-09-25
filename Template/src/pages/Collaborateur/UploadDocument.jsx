import { useEffect, useState } from "react";
import AjoutDocument from "../../components/Collaborateurs/AjoutDocument";
import api from "../../components/axios";

export default function UploadDocument() {
    const [allDocuments, setAllDocuments] = useState([])

    const fetchAllDocuments = () => {
        api.get('/documents/type')
            .then((response) => {
                setAllDocuments(response.data)
            })
    } 

    useEffect(() => {
        fetchAllDocuments()
    }, [])

    return <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-6">
        <div className="mb-4 sm:mb-0 flex items-center justify-center w-full">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold"> Documents administratifs </h1>
        </div>
        <AjoutDocument documents={allDocuments || []}/>
    </div>
}