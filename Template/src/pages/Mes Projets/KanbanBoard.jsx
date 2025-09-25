import React, { useContext, useEffect, useState } from 'react';
import Column from '../../components/Projets/components/Column';
import api from '../../components/axios';
import { AppContext } from '../../context/AppContext';

export default function KanbanBoard({ project, columns, setColumns }) {
  const { user } = useContext(AppContext)
  const [draggedCard, setDraggedCard] = useState(null);

  const handleDragStart = (e, card) => {
    setDraggedCard(card);
  };

  // const handleDrop = (e, columnName) => {
  //   if (!draggedCard) return;

  //   // Remove card from old column
  //   const newColumns = columns.map(col => {
  //     if (col.cards.find(c => c.id === draggedCard.id)) {
  //       return {
  //         ...col,
  //         cards: col.cards.filter(c => c.id !== draggedCard.id),
  //       };
  //     }
  //     return col;
  //   });

  //   // Update card status
  //   const updatedCard = { ...draggedCard, status: columnName };

  //   // Add card to the target column
  //   const targetIndex = newColumns.findIndex(col => col.title === columnName);
  //   if (targetIndex !== -1) {
  //     newColumns[targetIndex] = {
  //       ...newColumns[targetIndex],
  //       cards: [...newColumns[targetIndex].cards, updatedCard],
  //     };
  //   }

  //   setColumns(newColumns);
  //   setDraggedCard(null);
  // };



  const fetchTaskProject = (projectId) => {
    api.get('/getTaches/' + projectId)
      .then((response) => {
        var tasks = response.data.tasks;

        if (user.role === 'user') {
          tasks = tasks.filter((task) => task.user_allocated_id === user.id);
        } 

        // Define fixed columns
        const fixedColumns = [
          { title: "To-Do", cards: [] },
          { title: "In-Progress", cards: [] },
          { title: "Review", cards: [] },
          { title: "Deploy", cards: [] },
          { title: "Done", cards: [] }
        ];

        // Distribute tasks into columns 
        tasks.forEach(task => {
          const status = task.status || "To-Do";
          const column = fixedColumns.find(c => c.title === status);
          if (column) {
            column.cards.push(task);
          }
        });
        setColumns(fixedColumns);
      })
      .catch((error) => {
        console.log(error.response?.data?.message || error.message);
      });
  };


  useEffect(() => {
    fetchTaskProject(project);
  }, [project]);


  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;
    try {
      await api.put('/taches/' + Number(taskId) + '/update', {
        status: newStatus,
        card_id: Number(taskId)
      });
      fetchTaskProject(project);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };


  //  md:items-center lg:items-center lg:md:justify-center  sm:items-center  sm:gap-4
  return (
    <div className="flex gap-2 p-4 lg:flex-row md:flex-row sm:flex-col lg:justify-start md:justify-start sm:justify-center w-full overflow-x-auto overflow-y-hidden h-[66vh] scrollbar scrollbar-thin scrollbar-thumb-rounded">
      {columns.map((col) => (
        <Column
          key={col.title}
          title={col.title}
          cards={col.cards}
          isNote={col.title === 'Completed'}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          projectId={project}
          fetchTaskProject={fetchTaskProject}
        />
      ))}
    </div>
  );
}
