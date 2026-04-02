
export const makeRow = () => ({ 
  id: crypto.randomUUID(), 
  account: "", 
  debit: "", 
  credit: "" 
});

export const getNextJournalId = (entries) => {
  if (!entries || entries.length === 0) return "JE1001";

  const numbers = entries
    .map(e => parseInt(e.id.replace("JE", "")))
    .filter(n => !isNaN(n));

  const maxNumber = numbers.length ? Math.max(...numbers) : 1000;

  return `JE${maxNumber + 1}`;
};

export const resetForm = (entries) => ({
  id: getNextJournalId(entries),
  description: "",
  date: new Date().toISOString().split("T")[0],
  rows: [makeRow(), makeRow()],
});

export const isValidNumber = (value) => {
  return value === "" || /^\d*\.?\d*$/.test(value);
};

export const calculateTotals = (rows) => {
  return rows.reduce((acc, { debit, credit }) => {
    acc.debit += parseFloat(debit) || 0;
    acc.credit += parseFloat(credit) || 0;
    return acc;
  }, { debit: 0, credit: 0 });
};

export const sortRows = (rows) => {
  return [...rows].sort((a, b) => {
    const aIsDebit = a.debit && a.debit !== "";
    const bIsDebit = b.debit && b.debit !== "";

    if (aIsDebit && !bIsDebit) return -1;
    if (!aIsDebit && bIsDebit) return 1;

    return 0;
  });
};