import { useState } from "react";
import useResizable from "./components/hooks/useResizable";
import JournalEntry from "./components/JournalEntry/JournalEntry";
import Journals from "./components/Journals/Journals";

const staticEntries = [
  {
    id: "1001",
    date: "2023-01-01",
    description: "Cash sale",
    rows: [
      { id: "1", account: "1", debit: "100", credit: "0" },
      { id: "2", account: "2", debit: "0", credit: "100" },
    ],
  },
  {
    id: "1002",
    date: "2023-01-03",
    description: "Paid rent",
    rows: [
      { id: "1", account: "5", debit: "500", credit: "0" },
      { id: "2", account: "1", debit: "0", credit: "500" },
    ],
  },
  {
    id: "1003",
    date: "2023-01-05",
    description: "Salaries paid",
    rows: [
      { id: "1", account: "6", debit: "1200", credit: "0" },
      { id: "2", account: "1", debit: "0", credit: "1200" },
    ],
  },
];


const App = () => {
  const { leftWidth, containerRef, onMouseDown, onMouseMove, onMouseUp } = useResizable(50);

  const [entries, setEntries] = useState([...staticEntries]);

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