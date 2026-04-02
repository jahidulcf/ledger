import { useState } from 'react';
import accountsData from '../../../assets/accounts.json';

const formatDate = (date) => new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

const Entry = ({ entry }) => {
  const [expanded, setExpanded] = useState(false);
  const {id, date, description, rows} = entry

  const getAccountName = (id) => accountsData.find(a => a.id === id)?.name ?? id;

  // Sum all debits for this entry 
  const totalAmount = rows.reduce((sum, r) => sum + Number(r.debit || 0), 0)

  const onToggle = () => setExpanded(!expanded);

  return (
    <>
      {/* 🔹 Summary Row */}
      <tr className="cursor-pointer hover:bg-gray-50 transition" onClick={onToggle}>

        <td className="p-2 text-xs text-gray-400 whitespace-nowrap w-24 flex justify-between items-center">
          {formatDate(date)}
          <svg
            className={`ml-1 h-3 w-3 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </td>
        <td colSpan={expanded ? 3 : 2} className="py-2 text-sm text-gray-800">
          {description}
        </td>

        {/* Amount (only when collapsed) */}
        {!expanded && (
          <td className="text-right w-24 text-gray-800">{totalAmount}</td>
        )}
        <td className="p-2 text-right text-xs w-24 text-gray-400">{id}</td>
      </tr>

      {/* 🔹 Expanded Row */}
      {expanded &&
        rows.map((row) => (
          <tr key={row.id} className='cursor-pointer hover:bg-gray-50 transition' onClick={onToggle}>
            <td />
            <td className={`py-2 text-sm border-t border-dashed border-gray-200 ${row.credit ? 'pl-6 text-gray-400' : 'text-gray-700'}`}>
              {getAccountName(row.account)}
            </td>
            <td className="py-2 text-right text-sm text-gray-800 w-24 border-t border-dashed border-gray-200">
              {row.debit ? `DR ${row.debit}` : ''}
            </td>
            <td className="py-2 text-right text-sm text-gray-400 w-24 border-t border-dashed border-gray-200">
              {row.credit ? `CR ${row.credit}` : ''}
            </td>
            <td></td>
          </tr>
        ))
      }
      {/* Divider */}
      <tr>
        <td colSpan={5} className="border-b border-gray-300" />
      </tr>
    </>
  );
};

export default Entry;