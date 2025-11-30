import { type UniqueIdentifier } from "@dnd-kit/core"

export function SortableItem ({itemId}: {itemId:UniqueIdentifier}) {
  return (
    <div className='border'>
      {`id:${itemId}`}
    </div>
  )
}