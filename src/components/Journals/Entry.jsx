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
            <td className="pr-2 text-gray-400 text-xs whitespace-nowrap w-24">
              {i === 0 ? formatDate(entry.date) : ''}
            </td>
            <td className={`px-2 text-sm py-0.5 ${hasCr ? 'pl-6 text-gray-400' : 'text-gray-700'}`}>
              {getAccountName(row.account)}
            </td>
            <td className="px-2 text-right text-sm text-gray-800 w-24">
              {Number(row.debit) > 0 ? row.debit : ''}
            </td>
            <td className="pl-2 text-right text-sm text-gray-800 w-24">
              {Number(row.credit) > 0 ? row.credit : ''}
            </td>
          </tr>
        );
      })}
      <tr>
        <td className="pr-2" />
        <td className="px-2 text-xs text-gray-400 italic pb-2">
          ({entry.description})
        </td>
        <td /><td />
      </tr>
      <tr>
        <td colSpan={4} className="border-b border-gray-100" />
      </tr>
    </>
  );
};

export default Entry;