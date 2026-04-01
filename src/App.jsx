import { useState } from "react";
import useResizable from "./components/hooks/useResizable";
import JournalEntry from "./components/JournalEntry/JournalEntry";
import Journals from "./components/Journals/Journals";
import entriesData from "./assets/entries.json";

const App = () => {
  const { leftWidth, containerRef, onMouseDown, onMouseMove, onMouseUp } = useResizable(50);

  const [entries, setEntries] = useState([...entriesData]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col lg:flex-row"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* Left — full width on mobile, resizable on lg */}
      <div className="w-full" style={{ width: `${leftWidth}%` }}>
        <JournalEntry entries ={entries} setEntries={setEntries}/>
      </div>

      {/* Divider — lg only */}
      <div
        onMouseDown={onMouseDown}
        className="hidden lg:flex items-center justify-center w-3 hover:bg-blue-50 cursor-col-resize transition-colors duration-150 shrink-0 group"
      >
        <div className="w-px h-full bg-gray-200 group-hover:bg-blue-300 transition-colors" />
      </div>

      {/* Right — full width on mobile, fills remaining on lg */}
      <div className="w-full lg:flex-1">
        <Journals entries={entries}/>
      </div>
    </div>
  );
};

export default App;