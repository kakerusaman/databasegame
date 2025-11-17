import { useState } from 'react';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { Sortable } from './components/Sortable';
import { SortableItem } from './components/SortableItem';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';

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

  const sampleProjectData =
{
  id: 'PJ1',
  name: 'Project 1',
  description: 'This is project 1',
  image_url: '',
  lists: [
    {
      id: 'L1',
      title: 'List 1',
      tickets: [
        {id: 'T1', title: 'Ticket 1', description: 'This is ticket 1'},
        {id: 'T2', title: 'Ticket 2', description: 'This is ticket 2'},
        {id: 'T3', title: 'Ticket 3', description: 'This is ticket 3'},
      ],
    },
    {
      id: 'L2',
      title: 'List 2',
      tickets: [
        {id: 'T4', title: 'Ticket 4', description: 'This is ticket 4'},
        {id: 'T5', title: 'Ticket 5', description: 'This is ticket 5'},
        {id: 'T6', title: 'Ticket 6', description: 'This is ticket 6'},
      ],
    },
    {
      id: 'L3',
      title: 'List 3',
      tickets: [
        {id: 'T7', title: 'Ticket 7', description: 'This is ticket 7'},
        {id: 'T8', title: 'Ticket 8', description: 'This is ticket 8'},
        {id: 'T9', title: 'Ticket 9', description: 'This is ticket 9'},
      ],
    },
    {
      id: 'L4',
      title: 'List 4',
      tickets: [],
    },
  ],
}

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
    <div className='flex justify-center items-center w-screen h-screen'>
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