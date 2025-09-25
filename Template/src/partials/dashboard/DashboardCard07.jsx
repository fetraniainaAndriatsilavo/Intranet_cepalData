
function DashboardCard07({ title, tasks}) {
  return (
    <div className="col-span-full xl:col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl ">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-gray-300">
            {/* Table header */}
            <thead className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs">
              <tr>
                <th className="p-2">
                  <div className="font-semibold text-center">Nom du Projet </div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center"> Status </div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center"> Date </div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-gray-100 dark:divide-gray-700/60">
              {/* Row */}
              {
                tasks && tasks.slice(0, 10).map((task, key) => {
                  return <tr className='cursor-pointer hover:bg-gray-50' key={key}
                    onClick={() => {
                      window.location.href = '/mesprojets'
                    }}>
                    <td className="p-2">
                      <div className="text-center">{task.name} </div>
                    </td>
                    <td className="p-2">
                      <div className="text-center text-green-500">{task.status}</div>
                    </td>
                    <td className="p-2">
                      <div className="text-center text-sky-500">{task.start_date}</div>
                    </td>
                  </tr>
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard07;
