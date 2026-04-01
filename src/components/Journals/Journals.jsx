import Entry from "./Entry";

const entries = [
  {
    id: "1",
    date: "2023-01-01",
    description: "Cash sale",
    rows: [
      { id: "1", account: "1", debit: "100", credit: "0" },
      { id: "2", account: "2", debit: "0", credit: "100" },
    ],
  },
  {
    id: "2",
    date: "2023-01-03",
    description: "Paid rent",
    rows: [
      { id: "1", account: "5", debit: "500", credit: "0" },
      { id: "2", account: "1", debit: "0", credit: "500" },
    ],
  },
  {
    id: "3",
    date: "2023-01-05",
    description: "Salaries paid",
    rows: [
      { id: "1", account: "6", debit: "1200", credit: "0" },
      { id: "2", account: "1", debit: "0", credit: "1200" },
    ],
  },
];

const Journals = () => {
  return (
    <div className="w-full max-w-xl container mx-auto overflow-x-auto px-4">
      <h2 className="text-lg font-semibold my-4 px-4 border-l-4 border-gray-400 text-gray-400">Journal Entries — FY {new Date().getFullYear()}</h2>
      <table className="w-full min-w-96 border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="py-2 pr-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">
              Date
            </th>
            <th className="py-2 px-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Particulars
            </th>
            <th className="py-2 px-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">
              Debit
            </th>
            <th className="py-2 pl-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">
              Credit
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => (
            <Entry key={entry.id} entry={entry} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Journals;