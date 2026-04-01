import { BASE_STYLE } from "./constants";

const JournalRow = ({ 
    row, 
    rowError,
    accounts, 
    onChange, 
    onRemove, 
    canRemove,
}) => {
    return (
        <div className="flex space-x-2 items-center">

            {/* Account */}
            <select
                className={`flex-1 px-3 ${BASE_STYLE} ${rowError?.account ? "border-red-300 focus:ring-red-300" : ""}`}
                value={row.account}
                onChange={(e) => onChange(row.id, "account", e.target.value)}>

                <option value="" disabled>-- Select Account --</option>
                
                {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                        {account.name}
                    </option>
                ))}
            </select>

            {/* Debit */}
            <div className="relative w-24">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">Dr</span>
                <input
                    className={`w-full text-right pl-8 pr-3 ${BASE_STYLE} ${rowError?.debit ? "border-red-300 focus:ring-red-300" : ""}`}
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={row.debit}
                    onChange={(e) => onChange(row.id, "debit", e.target.value)}
                />
            </div>

            {/* Credit */}
            <div className="relative w-24">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">Cr</span>
                <input
                    className={`w-full text-right pl-8 pr-3 ${BASE_STYLE} ${rowError?.debit ? "border-red-300 focus:ring-red-300" : ""}`}
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={row.credit}
                    onChange={(e) => onChange(row.id, "credit", e.target.value)}
                />
            </div>

            {/* Remove button */}
            {canRemove && (
                <button 
                    className="text-sm px-2 py-1 text-gray-500 hover:text-gray-900 cursor-pointer"
                    type="button"
                    onClick={() => onRemove(row.id)}
                >
                    x
                </button>
            )}
        </div>
        
    );
};

export default JournalRow;
