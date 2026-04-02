import Entry from "./Entry";


const Journals = ({entries}) => {
  const year = entries[0]?.date ? new Date(entries[0].date).getFullYear() : new Date().getFullYear();

  return (
    <div className="w-full container mx-auto overflow-x-auto max-w-xl">
      <h2 className="text-lg font-semibold m-4 px-4 border-l-4 border-gray-400 text-gray-400">Journal Entries — FY {year}</h2>
      {/* Table Scrollable Container */}
      <div className="overflow-y-auto max-h-180 px-2">
        <table className="w-full min-w-96 border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-gray-50">
            <tr className="border-b border-gray-300">
              <th className="p-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">
                Date
              </th>
              <th className="py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Particulars
              </th>
              <th colSpan={2} className="p-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">
                Amount
              </th>
              <th className="p-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">
                Ref
              </th>
            </tr>
          </thead>
          <tbody>
            {[...entries].reverse().map(entry => (
              <Entry key={entry.id} entry={entry} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Journals;