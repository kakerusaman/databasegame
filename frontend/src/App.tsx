import { useState } from 'react';
import { arrayMove, verticalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { Sortable } from './components/Sortable';
import { SortableItem } from './components/SortableItem';
import { Droppable } from './components/Droppable';
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
  DragOverlay,
  closestCorners,
  type CollisionDetection,
  type Active,
  type Over,
} from '@dnd-kit/core';
import './index.css';

type Ticket = { id: string; title: string; description: string };
type List = { id: string; title: string; tickets: Ticket[] };
type ProjectDetail = { id: string; name: string; description: string; image_url: string; lists: List[] };

export const sampleProjectData: ProjectDetail = {
  id: 'PJ1',
  name: 'Project 1',
  description: 'This is project 1',
  image_url: '',
  lists: [
    {
      id: 'L1',
      title: 'List 1',
      tickets: [
        { id: 'T1', title: 'Ticket 1', description: 'This is ticket 1' },
        { id: 'T2', title: 'Ticket 2', description: 'This is ticket 2' },
        { id: 'T3', title: 'Ticket 3', description: 'This is ticket 3' },
      ],
    },
    {
      id: 'L2',
      title: 'List 2',
      tickets: [
        { id: 'T4', title: 'Ticket 4', description: 'This is ticket 4' },
        { id: 'T5', title: 'Ticket 5', description: 'This is ticket 5' },
        { id: 'T6', title: 'Ticket 6', description: 'This is ticket 6' },
      ],
    },
    {
      id: 'L3',
      title: 'List 3',
      tickets: [
        { id: 'T7', title: 'Ticket 7', description: 'This is ticket 7' },
        { id: 'T8', title: 'Ticket 8', description: 'This is ticket 8' },
        { id: 'T9', title: 'Ticket 9', description: 'This is ticket 9' },
      ],
    },
    {
      id: 'L4',
      title: 'List 4',
      tickets: [],
    },
  ],
};

export default function App() {
  const [projectData, setProjectData] = useState<ProjectDetail>(sampleProjectData);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    if (!active) return;
    setActiveId(active.id);
  }

  function getData(event: { active: Active; over: Over | null }) {
  const {active, over} = event;
  // キャンセルされた、もしくはターゲットがない場合はリターン
  if(!active || !over) return;
  // ドラッグアイテムとターゲットが同じ場合はリターン
  if(active.id === over.id) return;
  // activeのデータを取得
  const fromData = active.data.current?.sortable;
  if(!fromData) return;
  // overのデータを取得
  const toData = over.data.current?.sortable;
  const toDataNotSortable = {
    containerId: over.id,
    index: NaN,
    items: NaN,
  }
  // データを返す
  return {
    from: fromData,
    to: toData ?? toDataNotSortable,
  };
}

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const data = getData(event);
    if(!data) return;
    const {from, to} = data;
    if(from.containerId !== to.containerId) return;
    const list = projectData.lists.find(list => list.id == from.containerId);
    if(!list) return;
    const newTickets = arrayMove(list.tickets, from.index, to.index);
    const newLists = projectData.lists.map(list => {
      if(list.id === from.containerId) return {...list, tickets: newTickets};
      return list;
    });
    setProjectData({...projectData, lists: newLists});
  }

function handleDragOver(event: DragOverEvent){
    const data = getData(event);
    if(!data) return;
    const {from, to} = data;
    if(from.containerId === to.containerId) return;
    const fromList = projectData.lists.find(list => list.id == from.containerId);
    const toList = projectData.lists.find(list => list.id == to.containerId);
    if(!fromList || !toList) return;
    const moveTicket = fromList.tickets.find(ticket => ticket.id === from.items[from.index]);
    if(!moveTicket) return;
    const newFromTickets = fromList.tickets.filter((ticket) => ticket.id !== moveTicket.id);
    const newToTickets = [...toList.tickets.slice(0, to.index), moveTicket, ...toList.tickets.slice(to.index)];
    const newLists = projectData.lists.map(list => {
      if(list.id === from.containerId) return {...list, tickets: newFromTickets};
      if(list.id === to.containerId) return {...list, tickets: newToTickets};
      return list;
    });
    setProjectData({...projectData, lists: newLists});
  }

  const customClosestCorners: CollisionDetection = (args) => {
    console.log(args);
    const cornerCollisions = closestCorners(args);
    // 一番近いリストのコンテナを取得
    const listIds = new Set(projectData.lists.map(list => list.id));
    const closestContainer = cornerCollisions.find((c) => {
      return listIds.has(c.id.toString())
    });
    if(!closestContainer) return cornerCollisions;
    // closestContainerの中のチケットのみを取得
    const collisions = cornerCollisions.filter(({ data }) => {
      if(!data) return false;
      const droppableData = data.droppableContainer?.data?.current;
      if(!droppableData) return false;
      const { containerId } = droppableData.sortable;
      return closestContainer.id === containerId;
    });
    // 中身のチケットがない場合は、closestContainerを返す
    if (collisions.length === 0) {
      return [closestContainer];
    }
    // 中身のチケットがある場合は、collisionsを返す
    return collisions;
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      collisionDetection={customClosestCorners}
      id={projectData.id}
    >
      <div className="flex justify-center items-start w-screen min-h-screen gap-8 p-8">
        {projectData.lists.map((list) => (
          <SortableContext key={list.id} items={list.tickets} strategy={verticalListSortingStrategy}>
            <Droppable key={list.id} id={list.id} isOverAddClass="border-blue-400 bg-blue-50">
              <div className="flex flex-col gap-4 p-4 border min-h-[200px] min-w-[220px] bg-white rounded">
                <h3 className="font-semibold">{list.title}</h3>
                <div className="flex flex-col gap-2">
                  {list.tickets.map((ticket) => (
                    <Sortable key={ticket.id} id={ticket.id}>
                      <SortableItem itemId={ticket.id} />
                    </Sortable>
                  ))}
                </div>
              </div>
            </Droppable>
          </SortableContext>
        ))}

        {activeId && (
          <DragOverlay>
            <SortableItem itemId={activeId} />
          </DragOverlay>
        )}
      </div>
    </DndContext>
  );
}
