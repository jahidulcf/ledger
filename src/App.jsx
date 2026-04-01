import JournalEntry from "./components/JournalEntry/JournalEntry";
import Journals from "./components/Journals/Journals";

const App = () => {

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      <JournalEntry />
      <Journals />
    </div>
  );
};

export default App;