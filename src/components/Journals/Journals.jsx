import Entry from "./Entry";


const Journals = ({entries}) => {
  const year = entries[0]?.date ? new Date(entries[0].date).getFullYear() : new Date().getFullYear();

  return (
    <div className="w-full max-w-xl container mx-auto overflow-x-auto px-4">
      <h2 className="text-lg font-semibold my-4 px-4 border-l-4 border-gray-400 text-gray-400">Journal Entries — FY {year}</h2>
      {/* Table Scrollable Container */}
      <div className="overflow-y-auto max-h-150">
        <table className="w-full min-w-96 border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b border-gray-300">
              <th className="py-2 px-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">
                Journal ID
              </th>
              {/* <th className="py-2 pr-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">
                Date
              </th> */}
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