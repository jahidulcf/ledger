import JournalRow from "./JournalRow";
import { BASE_STYLE, SEED_ACCOUNTS } from "./constants";
import useJournalForm from "./useJournalForm";

const JournalEntry = ({ entries, setEntries }) => {

    const { form, errors, handleField, handleRow, addRow, removeRow, saveEntry } = useJournalForm(entries, setEntries);
    
    return (
        <form className="flex flex-col w-full p-4 space-y-2 lg:h-screen">

            {/* Form header and date */}
            <div className="flex justify-between items-baseline">
                <div className="flex items-baseline mb-8 gap-2 flex-col md:flex-row">
                    <h2 className="text-xl text-gray-800 font-semibold">Journal Entry</h2>
                    <span className="bg-gray-100 rounded px-3 py-1 text-xs font-semibold text-gray-500"># {form.id}</span>
                </div>

                <div>
                    <input
                        className= {`px-3 ${BASE_STYLE} ${errors.date ? "border-red-300 focus:ring-red-300" : ""}`}
                        type="date"
                        value={form.date}
                        onChange={(e) => handleField("date", e.target.value)} />
                    {errors.date && <p className="text-xs text-red-600">{errors.date}</p>}
                </div>
            </div>



            {/* Description */}
            <div className="mb-8">
                <textarea
                    className={`w-full p-3 resize-none ${BASE_STYLE} ${errors.description ? "border-red-300 focus:ring-red-300" : ""}`}
                    placeholder="Transaction description"
                    maxLength={100}
                    value={form.description}
                    onChange={(e) => handleField("description", e.target.value)} />

                {errors.description && <p className="text-xs text-red-600">{errors.description}</p>}
            </div>



            {/* render rows conditionally based on number of rows in the form */}
            {form.rows.map((row) => (
                    <JournalRow
                        key={row.id}
                        row={row}
                        rowError={errors.rows?.[row.id]}
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

            {/* Balance error */}
            {errors.balance && <p className="text-xs text-red-600">{errors.balance}</p>}


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