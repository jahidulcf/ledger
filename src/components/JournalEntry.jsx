import { useState } from "react";

const SEED_ACCOUNTS = [
  { id: "1", name: "Cash", type: "Asset" },
  { id: "2", name: "Accounts Receivable", type: "Asset" },
  { id: "3", name: "Accounts Payable", type: "Liability" },
  { id: "4", name: "Sales Revenue", type: "Income" },
  { id: "5", name: "Rent Expense", type: "Expense" },
  { id: "6", name: "Salaries Expense", type: "Expense" },
  { id: "7", name: "Owner Equity", type: "Equity" },
];

const makeRow = () => ({ id: crypto.randomUUID(), account: "", debit: "", credit: "" });

const resetForm = () => ({
  description: "",
  date: new Date().toISOString().split("T")[0],
  rows: [makeRow(), makeRow()],
});

const isValidNumber = (value) => {
  return value === "" || /^\d*\.?\d*$/.test(value);
};

const JournalEntry = () => {
    const [form, setForm] = useState(() => resetForm());

    // update date, description
    const handleField = (field, value) => {
        setForm(prev => ({...prev, [field]: value}));
    }

    // update account, debit, credit for each row
    const handleRow = (id, field, value) => {
        setForm(prev => {
            if ((field === "debit" || field === "credit") && !isValidNumber(value)) {
                return prev; // ignore invalid input
            }

            return {
                ...prev,
                rows: prev.rows.map(row => {
                    if (row.id !== id) return row;

                    const updated = { ...row, [field]: value };

                    // enforse Dr/Cr rule for each row: if debit is updated, credit should be cleared and vice versa
                    if (field === "debit") updated.credit = "";
                    if (field === "credit") updated.debit = "";

                    return updated
                })
            }
        });
    }

    const saveEntry = () => {
        console.log("Form data: ", form);
        setForm(resetForm());
    }

    const addRow = () => {
        setForm(prev => ({
            ...prev,
            rows: [...prev.rows, makeRow()]
        }))
    }

    const removeRow = (id) => {
        if (form.rows.length === 2) return;
        setForm(prev => ({
            ...prev,
            rows: prev.rows.filter(row => row.id !== id)
        }))
    }

    // const totals = form.rows.reduce((acc, { debit, credit}) => {
    //     acc.debit += parseFloat(debit) || 0;
    //     acc.credit += parseFloat(credit) || 0;
    //     return acc;
    // }, { debit: 0, credit: 0 });

    return (
        <form className="p-4 space-y-2 border-gray-200 max-w-xl mx-auto">
            <div className="flex justify-between items-baseline">
                <div className="flex items-baseline mb-8 gap-2">
                    <h2 className="text-xl text-gray-800 font-semibold">Journal Entry</h2>
                    <span className="bg-gray-100 rounded px-3 py-1 text-xs font-semibold text-gray-500"># JE1001</span>
                </div>
                <input
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            type="date"
                            value={form.date}
                            onChange={(e) => handleField("date", e.target.value)} />
            </div>

            <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Transaction description"
                value={form.description}
                onChange={(e) => handleField("description", e.target.value)} />


            {form.rows.map( row => (
                <div key={row.id} 
                    className="flex space-x-2 items-center">

                    <select
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={row.account}
                        onChange={(e) => handleRow(row.id, "account", e.target.value)}>

                        <option value="" disabled>-- Select Account --</option>
                        
                        {SEED_ACCOUNTS.map((account) => (
                            <option key={account.id} value={account.id}>
                                {account.name}
                            </option>
                        ))}
                    </select>

                    <div className="relative w-24">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
                            Dr
                        </span>

                        <input
                            className="w-full text-right border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            type="text"
                            placeholder="0.00"
                            value={row.debit}
                            onChange={(e) => handleRow(row.id, "debit", e.target.value)}
                        />
                    </div>
                    <div className="relative w-24">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">
                            Cr
                        </span>

                        <input
                            className="w-full text-right border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            type="text"
                            placeholder="0.00"
                            value={row.credit}
                            onChange={(e) => handleRow(row.id, "credit", e.target.value)}
                        />
                    </div>

                    {/* Add remove button if more than 2 rows */}
                    {form.rows.length > 2 && 
                        <button 
                            className="text-xs font-light text-gray-500 hover:text-gray-900 cursor-pointer" 
                            type="button"
                            onClick={() => removeRow(row.id)}
                        >x</button>
                    }
                </div>
            ))}

            <div>
                <button 
                    className="text-sm text-gray-500 hover:text-gray-900 cursor-pointer px-2 py-1 rounded hover:bg-gray-100" 
                    type="button"
                    onClick={addRow}
                >+ Add Row</button>
            </div>

            <button
                className="w-full rounded-lg px-3 py-2 text-sm text-white bg-gray-600 hover:bg-gray-700 focus:border-transparent cursor-pointer mt-8"
                type="button"
                onClick={saveEntry}
            >
                Save Entry
            </button>
        </form>
    )
};

export default JournalEntry;