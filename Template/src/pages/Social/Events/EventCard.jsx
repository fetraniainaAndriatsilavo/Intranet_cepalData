import EventDate from "./EventDate";

export default function EventCard({ evenement }) {
  let d = new Date(evenement.date)
  let [month, day] = [d.getMonth(), d.getDate()] 

  function formatHour(d) {
    const date = new Date(d);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }
  return (
    <div className="flex flex-row w-full items-center justify-center gap-3 mb-3 p-2">
      <div className="event-date w-1/3 p-1">
        <EventDate day={day} month={month}> </EventDate>
      </div>
      <div className="event-infos w-2/3">
        <h3 className="text-sky-500 font-semibold hover:underline cursor-pointer">{evenement.title} </h3>
        <span className="text-sm font-semibold"> Horaires {formatHour(evenement.date)}  </span> <br />
        <span className="text-sm text-gray-400 "> {evenement.description}  </span>
      </div>
    </div>
  );
}
