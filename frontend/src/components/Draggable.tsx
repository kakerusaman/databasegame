import {useDraggable} from '@dnd-kit/core';
import "../styles.css";

type DraggableProps = {
  label: string;
  id: string;
};

export default function Draggable({id,label}: DraggableProps) {
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id: id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.9 : 1,
    cursor: "grab",
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      className="draggable"
      style={style}
      {...listeners}
      {...attributes}
    >
      {label}
    </div>
  );
}