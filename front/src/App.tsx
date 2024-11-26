import React from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface Item {
  id: string;
  name: string;
}

function App() {
  const items: Item[] = [
    {
      id: "1",
      name: 'item1',
    },
    {
      id: "2",
      name: 'item2',
    },
    {
      id: "3",
      name: 'item3',
    }
  ];

  const onDragEnd = (result: any) => {
    // ドラッグ＆ドロップ後の処理をここに追加
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {item.name}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default App;