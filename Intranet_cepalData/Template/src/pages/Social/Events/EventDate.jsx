export default function EventDate({ month, day }) {
  const Month = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Juin",
    "Jul",
    "Août",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  return (
    <div className="w-full rounded-md overflow-hidden border border-red-300 shadow-sm">
      <div className="bg-red-500 text-white font-semibold text-center py-3 px-1 text-sm tracking-wide">
        {Month[month]}
      </div>
      <div className="text-gray-800 text-3xl font-bold text-center py-4 bg-white">
        {day}
      </div>
    </div>

  );
}
