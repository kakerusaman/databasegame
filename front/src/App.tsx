import React from "react";
import DragDropContextComponent from "./components/ui/DoragDropContext";
import './App.css'; // CSSファイルをインポート

const App: React.FC = () => {
  return (
    <div>
      <DragDropContextComponent />
    </div>
  );
}

export default App;