import { useState } from 'react';
import Card from './Card';
import CreateTask from '../create/CreateTask';

export default function Column({ title, cards, isNote = false, onDrop, onDragStart }) { 
  const [open, setOpen] = useState(false) 

  return (
    <div
      className="w-[300px] mx-2"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, title)}
    >
      <div className="flex items-center justify-between flex-row p-3 w-full">
        <h3 className="font-semibold text-lg">{title}</h3>
        <button className="font-bold text-sky-600 cursor-pointer" onClick={() => {
          setOpen(true)
        }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-plus"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 5l0 14" />
            <path d="M5 12l14 0" />
          </svg>
        </button>
      </div>
      {cards.map((card, index) => (
        <Card key={index} data={card} isNote={isNote} onDragStart={onDragStart} />
      ))}  
      <CreateTask open={open} onClose={() => { setOpen(false)}} />
    </div>
  );
}
