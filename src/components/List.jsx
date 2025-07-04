import React, { useState } from "react";

// Dummy categories (replace with backend data later)
const dummyCategories = [
  { id: 1, name: "Food" },
  { id: 2, name: "Rent" },
  { id: 3, name: "Entertainment" },
];

export default function TransactionPage() {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      amount: 50.0,
      type: "expense",
      category: "Food",
      date: "2025-07-04",
      description: "Groceries",
    },
  ]);

  const [formData, setFormData] = useState({
    amount: "",
    type: "expense",
    category_id: "",
    date: "",
    description: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddTransaction = (e) => {
    e.preventDefault();

    const newTransaction = {
      id: transactions.length + 1,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category:
        dummyCategories.find(
          (cat) => cat.id === parseInt(formData.category_id)
        )?.name || "Unknown",
      date: formData.date,
      description: formData.description,
    };

    setTransactions([...transactions, newTransaction]);

    setFormData({
      amount: "",
      type: "expense",
      category_id: "",
      date: "",
      description: "",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-red-400">
        💰 Add your transactions
      </h1>

      {/* Form */}
      <form
        onSubmit={handleAddTransaction}
        className="bg-yellow-300 shadow-md rounded-lg p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Add Transaction
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="amount"
            type="number"
            step="0.01"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Category</option>
            {dummyCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            name="description"
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 md:col-span-2"
          />
        </div>

        <button
          type="submit"
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded transition duration-300"
        >
          Add Transaction
        </button>
      </form>

      {/* Transactions List */}
      <div className="overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Transactions
        </h2>
        <table className="min-w-full bg-white border border-gray-900 rounded-lg">
          <thead className="bg-blue-100">
            <tr>
              <th className="py-3 px-4 text-left border-b border-gray-900">
                Date
              </th>
              <th className="py-3 px-4 text-left border-b border-gray-900">
                Amount
              </th>
              <th className="py-3 px-4 text-left border-b border-gray-900">
                Type
              </th>
              <th className="py-3 px-4 text-left border-b border-gray-900">
                Category
              </th>
              <th className="py-3 px-4 text-left border-b border-gray-900">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="hover:bg-gray-50 transition duration-150"
              >
                <td className="py-3 px-4 border-b border-gray-800">
                  {tx.date}
                </td>
                <td className="py-3 px-4 border-b border-gray-800 text-green-700 font-medium">
                  ${tx.amount.toFixed(2)}
                </td>
                <td className="py-3 px-4 border-b border-gray-800 capitalize">
                  {tx.type}
                </td>
                <td className="py-3 px-4 border-b border-gray-800">
                  {tx.category}
                </td>
                <td className="py-3 px-4 border-b border-gray-800">
                  {tx.description}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-800 italic"
                >
                  No transactions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
