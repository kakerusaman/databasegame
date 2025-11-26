import { useState } from 'react';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import {Sortable} from './components/Sortable';
import {SortableItem} from './components/SortableItem';
import Droppable from './components/Droppable';
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  closestCorners,
  type CollisionDetection,
  type Active,
  type Over,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { sampleProjectData, type ProjectDetail } from './data';

export default function Page() {
  const [projectData, setProjectData] = useState<ProjectDetail>(sampleProjectData);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

    const customClosestCorners: CollisionDetection = (args) => {
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

  function handleDragStart(event: DragStartEvent) {
  const {active} = event;
  if(!active) return;
  setActiveId(active.id);
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

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      collisionDetection={customClosestCorners}
      id={projectData.id}
    >
      <div className='flex justify-center items-center w-screen h-screen gap-8'>
        {projectData.lists.map((list) => (
          <SortableContext items={list.tickets} key={list.id} id={list.id} strategy={verticalListSortingStrategy}>
            <Droppable key={list.id} id={list.id}>
              <div className='flex flex-col gap-8 p-4 border min-h-[600px] min-w-44'>
                {list.tickets.map((ticket) => (
                  <Sortable key={ticket.id} id={ticket.id}>
                    <SortableItem itemId={ticket.id}/>
                  </Sortable>
                ))}
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