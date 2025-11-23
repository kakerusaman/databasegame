import { useState } from 'react';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { Sortable } from './components/Sortable';
import { SortableItem } from './components//SortableItem';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import './index.css';

export default function Page() {
  const [items, setItems] = useState(
    {
      id: 'list-sample',
      title: 'List Sample',
      cards: [
        {id: 'card-1', title: 'Card 1'},
        {id: 'card-2', title: 'Card 2'},
        {id: 'card-3', title: 'Card 3'},
      ],
    },
  );

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;
    if (!over)return;
    if (active.id === over.id) return;
    const oldSortable = active.data.current?.sortable;
    const newSortable = over.data.current?.sortable;
    if (!oldSortable || !newSortable) return;
    
    setItems({
        ...items,
        cards: arrayMove(items.cards, oldSortable.index, newSortable.index),
      });
  }
  
  return (
    <div className='bg-red text-gray-800 border-2 border-gray-300 rounded-lg p-4'>
      <DndContext
        onDragEnd={handleDragEnd}
        id={items.id}
      >
        <SortableContext items={items.cards} key={items.id} id={items.id}>
          <div className='flex flex-col gap-4 border w-44 p-4'>
            {items.cards.map((card) => (
              <Sortable key={card.id} id={card.id}>
                <SortableItem itemId={card.id}/>
              </Sortable>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );

}