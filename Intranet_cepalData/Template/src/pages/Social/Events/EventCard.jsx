import EventDate from "./EventDate";

export default function EventCard({evenement}) {  
  let d = new Date(evenement.date) 
  let [month, day, hours, minutes] = [d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()]
  return (
    <div className="flex flex-row w-full items-center justify-center gap-3 mb-3 p-2">
      <div className="event-date w-1/3 p-1"> 
            <EventDate day={day} month={month}> </EventDate>
      </div>  
      <div className="event-infos w-2/3">
        <h3 className="text-sky-500 font-semibold hover:underline cursor-pointer">{evenement.title} </h3>  
        <span className="text-sm"> Horaires : {hours + "h " + minutes}  </span> <br /> 
        <span className="text-sm text-gray-400 "> { evenement.description }  </span>
      </div>
    </div>
  );
}
