import { useState } from "react";
import JournalRow from "./JournalRow";
import { BASE_STYLE, SEED_ACCOUNTS } from "./constant";


const makeRow = () => ({ id: crypto.randomUUID(), account: "", debit: "", credit: "" });

// reset the form to initial state
const resetForm = () => ({
  description: "",
  date: new Date().toISOString().split("T")[0],
  rows: [makeRow(), makeRow()],
});

// Velidate number input
const isValidNumber = (value) => {
  return value === "" || /^\d*\.?\d*$/.test(value);
};



// --------------------------
// JournalEntry Component
// --------------------------
const JournalEntry = () => {

    const [form, setForm] = useState(resetForm);
    const [errors, setErrors] = useState({});


    // Update simple fields: date, description
    const handleField = (field, value) => {
        setForm(prev => ({...prev, [field]: value}));

        // Clear errors if field is updated
        if (errors[field]) setErrors(prev => ({...prev, [field]: ""}))
    }

    // Update row-specific fields: account, debit, credit
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




    // Add a new row to the form
    const addRow = () => {
        setForm(prev => ({
            ...prev,
            rows: [...prev.rows, makeRow()]
        }))
    }

    // Remove a row from the form
    const removeRow = (id) => {
        if (form.rows.length === 2) return; // minimum of 2 rows
        setForm(prev => ({
            ...prev,
            rows: prev.rows.filter(row => row.id !== id)
        }))
    }



    // Calculate total debit and credit
    const totals = form.rows.reduce((acc, { debit, credit}) => {
        acc.debit += parseFloat(debit) || 0;
        acc.credit += parseFloat(credit) || 0;
        return acc;
    }, { debit: 0, credit: 0 });

    // Validate the form and return true if valid or false if invalid
    const validate = () => {
        const newErrors = {}

        // Date validation
        if (!form.date) newErrors.date = "Date is required";

        // Validate description
        if (!form.description.trim()) newErrors.description = "Description is required";

        const rowErrors = form.rows.map(row => {
            const err = {}
            if (!row.account) err.account = "Account is required"
            if (!row.debit && !row.credit) err.debit = "Enter debit or credit"
            return err
        })
        newErrors.rows = rowErrors

        const hasValue = form.rows.some(r => r.debit || r.credit);
        if (hasValue && totals.debit !== totals.credit) newErrors.balance = "Debit and credit should be equal"

        setErrors(newErrors)

        const hasErrors = newErrors.description || newErrors.balance || rowErrors.some(r => Object.keys(r).length > 0);

        return !hasErrors
    }


    
    const saveEntry = () => {
        if (!validate()) return

        console.log("Form data: ", form);
        setForm(resetForm());
    }


    // --------------------------
    // JSX Render
    // --------------------------
    return (
        <form className="flex flex-col w-full p-4 space-y-2 lg:h-screen">

            {/* Form header and date */}
            <div className="flex justify-between items-baseline">
                <div className="flex items-baseline mb-8 gap-2">
                    <h2 className="text-xl text-gray-800 font-semibold">Journal Entry</h2>
                    <span className="bg-gray-100 rounded px-3 py-1 text-xs font-semibold text-gray-500"># JE1001</span>
                </div>

                <div>
                    <input
                        className= {`px-3 ${BASE_STYLE} ${errors.date ? "border-red-300 focus:ring-red-300" : ""}`}
                        type="date"
                        value={form.date}
                        onChange={(e) => handleField("date", e.target.value)} />
                    <p>{errors.date && <span className="text-xs text-red-600">{errors.date}</span>}</p>
                </div>
            </div>



            {/* Description */}
            <div className="mb-8">
                <textarea
                    className={`w-full p-3 resize-none ${BASE_STYLE} ${errors.description ? "border-red-300 focus:ring-red-300" : ""}`}
                    placeholder="Transaction description"
                    value={form.description}
                    onChange={(e) => handleField("description", e.target.value)} />

                <p>{errors.description && <span className="text-xs text-red-600">{errors.description}</span>}</p>
            </div>



            {/* render rows conditionally based on number of rows in the form */}
            {form.rows.map((row) => (
                    <JournalRow
                        key={row.id}
                        row={row}
                        accounts={SEED_ACCOUNTS}
                        onChange={handleRow}
                        onRemove={removeRow}
                        canRemove={form.rows.length > 2}
                    /> 
                ))
            }


            {/* Add row button */}
            <div>
                <button
                    type="button"
                    onClick={addRow}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900 px-2 py-1 rounded-full transition-colors duration-200"
                >
                    + Add Row
                </button>
            </div>


            {/* Save Entry button */}
            <button
                type="button"
                onClick={saveEntry}
                className="w-full lg:w-fit self-end px-10 py-2 mt-6 text-sm font-semibold text-white bg-gray-600 rounded-lg shadow hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                >
                Save Entry
            </button>
        </form>
    )
};

export default JournalEntry;