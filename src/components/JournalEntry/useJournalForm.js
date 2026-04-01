import { useState } from "react";
import { calculateTotals, isValidNumber, makeRow, resetForm, sortRows } from "./journalUtils";

const useJournalForm = (entries, setEntries) => {

    const [form, setForm] = useState(resetForm(entries));
    const [errors, setErrors] = useState({});

    const totals = calculateTotals(form.rows);

    const handleField = (field, value) => {
        setForm(prev => ({...prev, [field]: value}));

        // Clear errors if field is updated
        if (errors[field]) setErrors(prev => ({...prev, [field]: ""}))
    }

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

        // Clear error for the specific row field that was updated
         const errorField = field === "account" ? "account" : "debit";

        if (errors.rows?.[id]?.[errorField]) {
            setErrors(prev => ({
                ...prev,
                rows: {
                    ...prev.rows,
                    [id]: { ...prev.rows[id], [errorField]: "" }
                }
            }));
        }

        // clear balance error when debit or credit changes
        if (field === "debit" || field === "credit") {
            if (errors.balance) setErrors(prev => ({ ...prev, balance: "" }));
        }
    }

    const addRow = () => {
        setForm(prev => ({
            ...prev,
            rows: [...prev.rows, makeRow()]
        }))
    }

    const removeRow = (id) => {
        if (form.rows.length === 2) return; // minimum of 2 rows
        setForm(prev => ({
            ...prev,
            rows: prev.rows.filter(row => row.id !== id)
        }))
    }

    const validate = () => {
        const newErrors = {}

        // Date validation
        if (!form.date) newErrors.date = "Date is required";

        // Validate description
        if (!form.description.trim()) newErrors.description = "Description is required";

        // rows errors validation
        const rowErrors = {};
        form.rows.forEach(row => {
            const err = {};
            if (!row.account) err.account = "Account is required";
            if (!row.debit && !row.credit) err.debit = "Debit or credit is required";
            if (Object.keys(err).length) rowErrors[row.id] = err
        })

        newErrors.rows = rowErrors

        const hasValue = form.rows.some(r => r.debit || r.credit);
        if (hasValue && totals.debit !== totals.credit) newErrors.balance = "Debit and credit should be equal"

        setErrors(newErrors)

        const hasErrors = newErrors.description || newErrors.balance || Object.keys(rowErrors).length > 0;

        return !hasErrors
    }

    const saveEntry = () => {
        if (!validate()) return;

        const sortedRows = sortRows(form.rows);
        const updatedEntries = [...entries, {...form, rows: sortedRows}];

        setEntries(updatedEntries);
        setForm(resetForm(updatedEntries));
    }

    return {
        form,
        errors,
        totals,
        handleField,
        handleRow,
        addRow,
        removeRow,
        saveEntry
    }
}

export default useJournalForm