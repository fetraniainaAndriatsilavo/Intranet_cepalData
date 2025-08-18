import AjoutDocument from "../../components/Collaborateurs/AjoutDocument";

export default function UploadDocument() {
    return <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold"> Documents Administratifs </h1>
        </div> 
        <AjoutDocument />   
    </div>
}