import React, { useState } from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import Droppable from "./components/Droppable";
import Draggable from "./components/Draggable";
import "./styles.css";

const ZONES = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
  "center",
] as const;

type ZoneId = (typeof ZONES)[number];
type Zones = Record<ZoneId, string | null>;
type Items = Record<string, string>;

export default function App() {
  const [zones, setZones] = useState<Zones>({
    "top-left": "item-1",
    "top-right": "item-2",
    "bottom-left": "item-3",
    "bottom-right": "item-4",
    center: "item-5",
  });

  const items: Items = {
    "item-1": "A",
    "item-2": "B",
    "item-3": "C",
    "item-4": "D",
    "item-5": "E",
  };

  const findZoneByItem = (itemId: string): ZoneId | null => {
    return (Object.keys(zones) as ZoneId[]).find((zone) => zones[zone] === itemId) || null;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    const sourceZone = findZoneByItem(activeId);
    const targetZone = overId as ZoneId;

    if (!sourceZone) return;

    setZones((prev) => {
      const newZones = { ...prev };
      const targetItem = prev[targetZone];
      newZones[sourceZone] = targetItem || null;
      newZones[targetZone] = activeId;
      return newZones;
    });
  };

  return (
    <div className="app">
      <h2>四隅 + 中央 の Droppable（dnd-kit）</h2>
      <p className="hint">
        ボックスをドラッグして別のマスにドロップすると入れ替わります。
      </p>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="stage" role="region" aria-label="dnd stage">
          {ZONES.map((zoneId) => {
            const itemId = zones[zoneId];
            return (
              <Droppable key={zoneId} id={zoneId}>
                {itemId ? (
                  <Draggable id={itemId} label={items[itemId]} />
                ) : (
                  <div className="placeholder" />
                )}
              </Droppable>
            );
          })}
        </div>
      </DndContext>

      <div className="legend">
        <strong>メモ</strong>: 各マスは 1
        アイテムのみ。必要なら複数アイテム対応やドロップ許容（空許可など）を追加できます。
      </div>
    </div>
  );
}
