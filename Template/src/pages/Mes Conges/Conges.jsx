import Absence from "./Absence";
export default function Conges() {
    return <div className="sm:flex flex-col gap-5 sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0 flex items-center justify-center w-full">
            <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
               Demande d'absence
            </h1>
        </div>
        <div className="bg-white w-1/2">
            <Absence />
        </div>
    </div>
}