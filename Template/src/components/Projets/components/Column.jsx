import { useState } from 'react';
import Card from './Card';
import ViewTask from '../view/ViewTask';
import PerfectScrollbar from 'react-perfect-scrollbar';
// import 'react-perfect-scrollbar/dist/css/styles.css';

export default function Column({ title, cards, isNote = false, onDrop, onDragStart, projectId, fetchTaskProject }) {
  const [openView, setOpenView] = useState(false);
  const [selectedTask, setSelectedTask] = useState(0);

  return (
    <div
      className="w-[350px] shrink-0 p-3
       overflow-y-auto scroll-container
        scroll-container:focus scroll-container:active 
        scroll-container:hover scrollbar scrollbar-thin 
        scrollbar-thumb-rounded 
      "
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, title)}
    >
      {/* Column header */}
      <div className="flex items-center justify-start flex-row p-3">
        <h3 className="font-semibold text-lg"> {title} </h3>
      </div>
      {/* Cards */}
      {cards.map((card, index) => (
        <Card
          key={card.id || index}
          data={card}
          isNote={isNote}
          onDragStart={(e) => onDragStart(e, card)}
          ViewCard={() => {
            setSelectedTask(card.id);
            setOpenView(true);
          }}
          projectId={projectId}
          fetchTaskProject={fetchTaskProject}
        />
      ))}
      <ViewTask
        open={openView}
        onClose={() => {
          setOpenView(false);
        }}
        id={selectedTask}
        projectId={projectId}
        fetchTaskProject={fetchTaskProject}
      />
    </div>
  );
} 
