const BASE_STYLE = "border border-gray-200 rounded-lg py-2 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring focus:ring-gray-500 focus:border-transparent transition-all duration-200 ease-in-out";

const SEED_ACCOUNTS = [
  { id: "1", name: "Cash", type: "Asset" },
  { id: "3", name: "Equipment", type: "Asset" },
  { id: "4", name: "Inventory", type: "Asset" },
  { id: "5", name: "Rent Expense", type: "Expense" },
  { id: "6", name: "Salaries Expense", type: "Expense" },
  { id: "7", name: "Utilities Expense", type: "Expense" },
  { id: "8", name: "Accounts Payable", type: "Liability" },
  { id: "9", name: "Accounts Receivable", type: "Asset" },
  { id: "10", name: "Owner Capital", type: "Equity" },
  { id: "11", name: "Sales Revenue", type: "Income" }
];

export { BASE_STYLE, SEED_ACCOUNTS };