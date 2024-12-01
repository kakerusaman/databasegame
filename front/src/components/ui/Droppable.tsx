// Droppable.tsx
import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Column, Task } from '../../Data';

interface DroppableComponentProps {
  column: Column;
  tasks: Task[];
}

const DroppableComponent: React.FC<DroppableComponentProps> = ({ column, tasks }) => {
  return (
    <div className="column">
      <h3>{column.title}</h3>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="task-list"
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="task"
                  >
                    {task.content}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default DroppableComponent;