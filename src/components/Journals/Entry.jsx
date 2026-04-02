import { SEED_ACCOUNTS } from '../JournalEntry/constants';

const formatDate = (date) => new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

const Entry = ({ entry }) => {
  const getAccountName = (id) => SEED_ACCOUNTS.find(a => a.id === id)?.name ?? id;

  return (
    <>
      {entry.rows.map((row, i) => {
        const hasCr = Number(row.credit) > 0;
        return (
          <tr key={row.id}>
            <td className="px-2 text-gray-400 text-xs whitespace-nowrap w-24">
              {i === 0 ? formatDate(entry.date) : ''}
            </td>
            <td className={`px-2 text-sm py-0.5 ${hasCr ? 'pl-6 text-gray-400' : 'text-gray-700'}`}>
              {getAccountName(row.account)}
            </td>
            <td className="px-2 text-right text-sm text-gray-800 w-24">
              {Number(row.debit) > 0 ? row.debit : ''}
            </td>
            <td className="px-2 text-right text-sm text-gray-800 w-24">
              {Number(row.credit) > 0 ? row.credit : ''}
            </td>
            <td className="p-2 py-0.5 text-gray-400 text-xs text-right whitespace-nowrap w-24">
              {i === 0 ? entry.id : ''}
            </td>
          </tr>
        );
      })}
      <tr>
        <td className="pr-2" />
        <td colSpan={4} className="px-2 py-2 text-xs text-gray-400 italic">
          <div className="w-full max-w-full overflow-hidden line-clamp-2">
            ({entry.description})
          </div>
        </td>
        <td /><td />
      </tr>
      <tr>
        <td colSpan={5} className="border-b border-gray-100" />
      </tr>
    </>
  );
};

export default Entry;