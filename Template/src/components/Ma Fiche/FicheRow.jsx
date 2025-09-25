export default function FicheRow({ data }) {
    const formatDate = (d) => {
        const date = new Date(d);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    return <tr
        className={`bg-white hover:bg-gray-50 odd:bg-white`}
    >
        <td className="px-6 py-4 font-medium whitespace-nowrap font-semibold flex flex-col leading-5"> {data.file_name} </td>
        <td className="px-6 py-4 text-center"> {data.type.name} </td>
        <td className="px-6 py-4 text-center"> {data.uploaded_by?.last_name + " " + data.uploaded_by?.first_name || ''} </td>
        <td className="px-6 py-4 text-center"> {formatDate(data.uploaded_at)}</td>
        <td className="px-6 py-4 text-center font-semibold ">
            <button className="text-white bg-sky-600 p-1.5 cursor-pointer rounded">
                <a
                    href={data.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Afficher
                </a>
            </button>
        </td>
    </tr>
}