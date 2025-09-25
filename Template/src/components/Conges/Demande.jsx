export default function Demande({ data, setInfos, setOpen }) {
  function getWorkingDays(startDateStr, endDateStr) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    let count = 0;

    if (endDate < startDate) {
      return 0;
    }

    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const day = currentDate.getDay();
      if (day !== 0 && day !== 6) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return count;
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

  return (
    <tr
      className={`bg-white hover:bg-gray-50 odd:bg-white hover:cursor-pointer ${data.status === 'refused' ? 'text-red-500' : 'text-gray-500'
        }`}
      onClick={() => {
        setOpen(true)
        setInfos(data)
      }}
    >
      {/* Nom d'utilisateur */}
      <td className="px-6 py-4 font-medium whitespace-nowrap font-semibold">
        {data.user?.last_name + ' ' + data.user?.first_name}
      </td>

      {/* Soldes */}
      <td className="px-6 py-4 text-center">
        {
          CongeType.includes(data.leave_type?.name)
            ? data.user?.ogc_leav_bal ?? 0
            : !excludedPermission.includes(data.leave_type?.name)
              ? data.user?.ogc_perm_bal ?? 0
              : data.user?.ogc_othr_bal ?? 0
        }
      </td>

      {/* Motif */}
      <td className="px-6 py-4">
        {data.leave_type?.name}
      </td>

      {/* Date de début */}
      <td className="px-6 py-4">
        {formatDate(data.start_date)}
      </td>

      {/* Date de fin */}
      <td className="px-6 py-4">{formatDate(data.end_date)}</td>

      {/* Durée */}
      <td className="px-6 py-4 text-center">
        {
          Number(data.number_day)
        }
      </td>
      {/* Créé le */}
      <td className="px-6 py-4">{formatDate(data.created_at)}</td>
    </tr>
  );
}

