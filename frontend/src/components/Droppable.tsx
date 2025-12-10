import {useDroppable} from '@dnd-kit/core';
import "../styles.css";

type DroppableProps = {
  children: React.ReactNode;
  id: string;
  isOverAddClass?: string;
};

export default function Droppable({children, id, isOverAddClass}: DroppableProps) {
  const {isOver, setNodeRef} = useDroppable({
    id: id,
  });

  return (
    <div ref={setNodeRef} className={isOver && isOverAddClass ? isOverAddClass : "" }>
      {children}
    </div>
  );
}