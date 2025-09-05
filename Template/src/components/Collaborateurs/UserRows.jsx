import api from "../axios";

export default function UserRows({ data, setAllUsers }) {

    const toggleArchive = (id, currentStatus) => {
        const newStatus = currentStatus === "inactive" ? "active" : "inactive";
        api.put(`/v1/users/${id}`, { status: newStatus })
            .then(() => {
                setAllUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.id == id ? { ...user, status: newStatus } : user
                    )
                );
            })
            .catch((error) => {
                console.error("Failed to update status:", error);
            });
    };


    return <tr
        className={`bg-white hover:bg-gray-50  odd:bg-white ${data.status == 'inactive' ? 'text-red-500 italic' : ''}`}
    >
        <td className="px-6 py-4 font-medium whitespace-nowrap font-semibold flex flex-col leading-5">
            <span>
                {data.last_name}
            </span>
            <span>
                {data.first_name}
            </span>
        </td>
        <td className="px-6 py-4 text-center">
            {data.email}
        </td>
        <td className="px-6 py-4 text-center">
            {data.position_name}
        </td>
        <td className="px-6 py-4 text-center">
            {data.department}
        </td>
        <td className="px-6 py-4 text-center">  {data.hire_date} </td>
        <td className="px-6 py-4 text-center font-semibold gap-3 flex items-center justify-center">
            <button onClick={() => {
                window.location.href = `/modif-utilisateur/${data.id}`;
            }} className="cursor-pointer" title="Modifier">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-gray-300 icon icon-tabler icons-tabler-outline icon-tabler-edit">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                    <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                    <path d="M16 5l3 3" />
                </svg>
            </button>
            <button onClick={(e) => {
                const action = data.status === "active" ? "archiver" : "restaurer";
                if (confirm(`Voulez-vous ${action} cet utilisateur?`)) {
                    e.preventDefault()
                    toggleArchive(data.id, data.status);
                }
            }} className="cursor-pointer" title={`${data.status == 'active' ? 'archiver' : 'restaurer'}`}>
                {
                    data.status && data.status == 'active' ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className=" text-red-500 icon icon-tabler icons-tabler-outline icon-tabler-trash">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4 7l16 0" />
                        <path d="M10 11l0 6" />
                        <path d="M14 11l0 6" />
                        <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                    </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className=" text-gray-700 icon icon-tabler icons-tabler-outline icon-tabler-restore">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M3.06 13a9 9 0 1 0 .49 -4.087" />
                        <path d="M3 4.001v5h5" />
                        <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                    </svg>
                }

            </button> </td>
    </tr >
}