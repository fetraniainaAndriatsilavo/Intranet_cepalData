;

function DashboardCard01({ title, soldes }) {
  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl p-1">
      <div className="px-6 pt-1 flex flex-row items-center justify-center gap-6">
        <header className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{title}</h2>
        </header>
        <div className="flex items-start">
          <div className="text-6xl font-bold text-gray-800 dark:text-gray-100 mr-2">{soldes} </div>
          <div className="text-sm font-medium text-green-700 px-1.5 bg-green-500/20 rounded-full">{title == 'Congés' && '+2 '} </div>
        </div>
      </div>
    </div>
  );
}
export default DashboardCard01;
