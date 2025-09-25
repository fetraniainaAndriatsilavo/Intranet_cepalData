import DoughnutChart from "../../charts/DoughnutChart";
// Elegant, professional color palette
const professionalPalette = [
  '#4F46E5', // Indigo
  '#0EA5E9', // Sky Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Rose
  '#6366F1', // Violet
  '#14B8A6', // Teal
  '#A855F7', // Purple
  '#F43F5E', // Pink
  '#22C55E', // Green
];

const hoverPalette = professionalPalette.map(color => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 0.85)`;
});


function DashboardCard06({ title, labels, value }) {
  const backgroundColors = value.map((_, i) => professionalPalette[i % professionalPalette.length]);
  const hoverColors = value.map((_, i) => hoverPalette[i % hoverPalette.length]);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: title,
        data: value,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: hoverColors,
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-3 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100 text-center">{title}</h2>
      </header>
      <DoughnutChart data={chartData } width={300} height={100} />  
    </div>
  );
}

export default DashboardCard06;
