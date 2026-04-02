import { useState } from "react";
import accountData from "../../assets/accounts.json";
import entriesData from "../../assets/entries.json";

const TYPES = ["Asset", "Liability", "Equity", "Income", "Expense"];

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const calcBalance = (accountId, entries) => {
  let balance = 0;
  for (const entry of entries) {
    for (const row of entry.rows) {
      if (String(row.account) === String(accountId)) {
        balance += parseFloat(row.debit) || 0;
        balance -= parseFloat(row.credit) || 0;
      }
    }
  }
  return balance;
};

const getAccountEntries = (accountId, entries) => {
  const rows = [];
  for (const entry of entries) {
    for (const row of entry.rows) {
      if (String(row.account) === String(accountId)) {
        rows.push({
          id: `${entry.id}-${row.id}`,
          entryId: entry.id,
          date: entry.date,
          description: entry.description,
          debit: parseFloat(row.debit) || 0,
          credit: parseFloat(row.credit) || 0,
        });
      }
    }
  }
  rows.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Pre-compute running balance here, outside of JSX
  let running = 0;
  return rows.map((row) => {
    running += row.debit - row.credit;
    return { ...row, running };
  });
};

// ─── Transaction Panel ───────────────────────────────────────────────────────

const TransactionPanel = ({ account, entries, onClose }) => {
  const rows = getAccountEntries(account.id, entries);
  const balance = calcBalance(account.id, entries);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl border border-gray-100 w-full max-w-2xl mx-4 overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-medium text-gray-900">{account.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{account.type}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">Balance</p>
              <p className={`text-sm font-medium ${balance < 0 ? "text-red-500" : "text-gray-900"}`}>
                {fmt(balance)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center text-xs border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="max-h-96 overflow-y-auto">
          {rows.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">No journal entries for this account</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs text-gray-400 font-normal px-5 py-2">Entry</th>
                  <th className="text-left text-xs text-gray-400 font-normal px-3 py-2">Date</th>
                  <th className="text-left text-xs text-gray-400 font-normal px-3 py-2">Description</th>
                  <th className="text-right text-xs text-gray-400 font-normal px-3 py-2">Debit</th>
                  <th className="text-right text-xs text-gray-400 font-normal px-3 py-2">Credit</th>
                  <th className="text-right text-xs text-gray-400 font-normal px-5 py-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-xs text-gray-400">{row.entryId}</td>
                    <td className="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">{row.date}</td>
                    <td className="px-3 py-3 text-gray-800 truncate max-w-45">{row.description}</td>
                    <td className="px-3 py-3 text-right text-gray-900">
                      {row.debit > 0 ? fmt(row.debit) : ""}
                    </td>
                    <td className="px-3 py-3 text-right text-gray-900">
                      {row.credit > 0 ? fmt(row.credit) : ""}
                    </td>
                    <td className={`px-5 py-3 text-right font-medium ${row.running < 0 ? "text-red-500" : "text-gray-700"}`}>
                      {fmt(row.running)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

const Account = () => {
  const [accounts, setAccounts] = useState(accountData);
  const [entries] = useState(entriesData);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", type: "Asset" });
  const [addForm, setAddForm] = useState({ name: "", type: "Asset" });
  const [openAccountId, setOpenAccountId] = useState(null);

  const openAccount = accounts.find((a) => a.id === openAccountId) ?? null;

  const handleAdd = () => {
    if (!addForm.name.trim()) return;
    setAccounts([...accounts, { id: crypto.randomUUID(), ...addForm }]);
    setAddForm({ name: "", type: "Asset" });
  };

  const handleDelete = (id) => {
    setAccounts(accounts.filter((a) => a.id !== id));
    if (editId === id) setEditId(null);
  };

  const startEdit = (acc) => {
    setEditId(acc.id);
    setEditForm({ name: acc.name, type: acc.type });
  };

  const cancelEdit = () => setEditId(null);

  const saveEdit = (id) => {
    if (!editForm.name.trim()) return;
    setAccounts(accounts.map((a) => (a.id === id ? { ...a, ...editForm } : a)));
    setEditId(null);
  };

  const totalBalance = accounts.reduce(
    (sum, a) => sum + calcBalance(a.id, entries),
    0
  );

  return (
    <div className="p-6 font-sans container mx-auto">

      {/* Header */}
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="text-sm font-medium text-gray-900">Accounts</h2>
        <span className="text-xs text-gray-400">
          {fmt(totalBalance)} total · {accounts.length} account{accounts.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Add bar */}
      <div className="flex gap-2 mb-5">
        <input
          className="flex-1 h-9 px-3 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 bg-white text-gray-900 placeholder-gray-400"
          placeholder="Account name"
          value={addForm.name}
          onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <select
          className="h-9 px-2 text-sm border border-gray-200 rounded-lg outline-none bg-white text-gray-900 cursor-pointer"
          value={addForm.type}
          onChange={(e) => setAddForm({ ...addForm, type: e.target.value })}
        >
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <button
          onClick={handleAdd}
          className="h-9 px-4 text-sm font-medium border border-gray-200 rounded-lg bg-white text-gray-900 hover:bg-gray-50 transition-colors"
        >
          + Add
        </button>
      </div>

      {/* List */}
      <div className="border border-gray-100 rounded-xl overflow-hidden">
        {accounts.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-400">No accounts yet</p>
        )}

        {accounts.map((acc) => {
          const balance = calcBalance(acc.id, entries);
          return editId === acc.id ? (

            /* Edit row */
            <div
              key={acc.id}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <input
                autoFocus
                className="flex-1 h-8 px-3 text-sm border border-gray-300 rounded-lg outline-none bg-white text-gray-900"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit(acc.id);
                  if (e.key === "Escape") cancelEdit();
                }}
              />
              <select
                className="h-8 px-2 text-sm border border-gray-200 rounded-lg outline-none bg-white text-gray-900"
                value={editForm.type}
                onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
              >
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
              <button
                onClick={() => saveEdit(acc.id)}
                className="h-8 px-3 text-xs font-medium border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="w-7 h-7 flex items-center justify-center text-xs border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

          ) : (

            /* Read row */
            <div
              key={acc.id}
              className="group flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
            >
              <span
                className="flex-1 text-sm text-gray-900 truncate cursor-pointer"
                onClick={() => setOpenAccountId(acc.id)}
              >
                {acc.name}
              </span>
              <span className="text-xs text-gray-400 border border-gray-100 rounded-full px-2 py-0.5">
                {acc.type}
              </span>
              <span
                className={`text-sm font-medium min-w-20 text-right cursor-pointer select-none ${
                  balance < 0 ? "text-red-500" : "text-gray-700"
                }`}
                onClick={() => setOpenAccountId(acc.id)}
                title="Click to view journal entries"
              >
                {fmt(balance)}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(acc)}
                  className="w-7 h-7 flex items-center justify-center text-sm border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                  title="Edit"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDelete(acc.id)}
                  className="w-7 h-7 flex items-center justify-center text-xs border border-gray-200 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>

          );
        })}
      </div>

      {/* Journal entries panel */}
      {openAccount && (
        <TransactionPanel
          account={openAccount}
          entries={entries}
          onClose={() => setOpenAccountId(null)}
        />
      )}

    </div>
  );
};

export default Account;