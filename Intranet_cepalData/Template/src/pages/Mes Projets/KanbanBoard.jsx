import React, { useState } from 'react';
import Column from '../../components/Projets/components/Column';

export default function KanbanBoard() {
  const [columns, setColumns] = useState({
    "To Do": [
      { title: 'Managing teams (book)', author: 'markus-james', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
      { title: 'User should receive a daily digest email' },
    ],
    "In Progress": [
      { title: 'Product Update - Q4 2024', type: 'Task' },
    ],
    Reviewing: [
      { title: 'Design new diagrams', author: 'jerzy-wierzy', type: 'Stories' },
    ],
    Completed: [
      {
        title: 'Note from Adrian Przetocki',
        content: 'Discussed roadmap #planning #team',
        timestamp: '2025-08-12 14:30',
        type: 'Bug'
      },
    ],
  });

  const [draggedCard, setDraggedCard] = useState(null);

  const handleDragStart = (e, card) => {
    setDraggedCard(card);
  };

  const handleDrop = (e, columnName) => {
    if (!draggedCard) return;

    // Remove from previous column
    const newColumns = { ...columns };
    for (const col in newColumns) {
      newColumns[col] = newColumns[col].filter((c) => c !== draggedCard);
    }

    // Add to new column
    newColumns[columnName].push(draggedCard);
    setColumns(newColumns);
    setDraggedCard(null);
  };

  return (
    <div className="flex gap-4 p-4">
      {Object.entries(columns).map(([title, cards]) => (
        <Column
          key={title}
          title={title}
          cards={cards}
          isNote={title === 'Completed'}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}
