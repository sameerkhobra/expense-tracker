import React, { useEffect, useState } from "react";

export default function FutureExpenditurePage() {

  const [futureExpenses, setFutureExpenses] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    date: "",
    description: "",
    category_id: "", // use your existing categories
    wallet_id: "",   // optional: link to Wallet
  });
  const [categories, setCategories] = useState([]);
  const [wallets, setWallets] = useState([]);
  
  // Get categories for dropdown
  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  // Get wallets for dropdown
  useEffect(() => {
    fetch("http://localhost:5000/wallets")
      .then((res) => res.json())
      .then(setWallets);
  }, []);

  // Get future expenses
  useEffect(() => {
    fetch("http://localhost:5000/transactions?future_expenses=1")
      .then((res) => res.json())
      .then(setFutureExpenses);
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTx = {
      amount: parseFloat(formData.amount),
      date: formData.date,
      description: formData.description,
      type: "expense",
      category_id: parseInt(formData.category_id),
      wallet_id: formData.wallet_id ? parseInt(formData.wallet_id) : null,
    };
    const res = await fetch("http://localhost:5000/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTx),
    });
    const saved = await res.json();
    setFutureExpenses([...futureExpenses, saved]);
    setFormData({
      amount: "",
      date: "",
      description: "",
      category_id: "",
      wallet_id: "",
    });
  };
  // Mark a future expense as paid
const handleMarkAsPaid = async (expenseId) => {
  const expense = futureExpenses.find((exp) => exp.id === expenseId);
  if (!expense) return;

  const newTransaction = {
    amount: expense.amount,
    date: expense.date,
    description: expense.description,
    type: "expense",
    category_id: expense.category_id,
    wallet_id: expense.wallet_id,
  };

  // 1. Add to main Transactions
  await fetch("http://localhost:5000/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTransaction),
  });

  // 2. Remove from future expenses
  await handleRemove(expenseId);
};

// Remove a future expense
const handleRemove = async (expenseId) => {
  await fetch(`http://localhost:5000/transactions/${expenseId}`, {
    method: "DELETE",
  });

  // Update local state
  setFutureExpenses((prev) =>
    prev.filter((exp) => exp.id !== expenseId)
  );
};

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        🔮 Future Expenditure
      </h1>

      {/* Add Future Expenditure */}
      <form
  onSubmit={handleSubmit}
  className="bg-white rounded-lg shadow p-6 mb-8 max-w-4xl mx-auto"
>
  <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
    Plan New Future Expense
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <input
      name="amount"
      type="number"
      step="0.01"
      placeholder="Amount"
      value={formData.amount}
      onChange={handleChange}
      required
      className="p-3 border border-gray-400 rounded w-full text-gray-800 placeholder-gray-500 bg-white"
    />

    <input
      name="date"
      type="date"
      value={formData.date}
      onChange={handleChange}
      required
      className="p-3 border border-gray-400 rounded w-full text-gray-800 placeholder-gray-500 bg-white"
    />

    <select
      name="category_id"
      value={formData.category_id}
      onChange={handleChange}
      required
      className="p-3 border border-gray-400 rounded w-full text-gray-800 bg-white"
    >
      <option value="">Select Category</option>
      {categories.map((cat) => (
  <option key={cat._id} value={cat._id}>{cat.name}</option>
))}

    </select>

    <select
      name="wallet_id"
      value={formData.wallet_id}
      onChange={handleChange}
      className="p-3 border border-gray-400 rounded w-full text-gray-800 bg-white"
    >
      <option value="">Select Wallet (optional)</option>
      {wallets.map((w, index) => (
  <option key={index} value={w.name}>
    {w.name}
  </option>
))}


    </select>

    <input
      name="description"
      type="text"
      placeholder="Description"
      value={formData.description}
      onChange={handleChange}
      className="p-3 border border-gray-400 rounded w-full md:col-span-2 lg:col-span-3 text-gray-800 placeholder-gray-500 bg-white"
    />
  </div>

  <div className="flex justify-center">
    <button
      type="submit"
      className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded transition"
    >
      Add Future Expense
    </button>
  </div>
</form>



      
  {/* Horizontal Timeline */}
<div className="bg-white rounded-lg shadow p-6">
  <h2 className="text-xl font-semibold text-gray-700 mb-4">
    Upcoming Expenses Timeline
  </h2>

  {futureExpenses.length === 0 ? (
    <p className="text-gray-500 italic">No future expenses yet.</p>
  ) : (
    <div className="relative">
      <div className="flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth scrollbar-hide cursor-grab">
        {futureExpenses
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map((exp) => (
            <div
              key={exp.id}
              className="flex-shrink-0 snap-center w-64 md:w-72 bg-gray-50 p-4 rounded-lg shadow flex flex-col items-center relative"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full text-white mb-2">
                💸
              </div>
              <time className="text-sm text-gray-500 mb-1">
                {new Date(exp.date).toLocaleDateString()}
              </time>
              <p className="text-gray-800 font-semibold mb-1">
                ₹ {Number(exp.amount).toFixed(2)}
              </p>
              <p className="text-gray-600 text-sm text-center mb-1">
                {exp.description}
              </p>
              <p className="text-xs text-gray-400 mb-2">
                {exp.wallet_type || "-"}
              </p>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleMarkAsPaid(exp.id)}
                  className="text-green-600 text-xs border border-green-600 px-2 py-1 rounded hover:bg-green-50"
                >
                  Mark as Paid
                </button>
                <button
                  onClick={() => handleRemove(exp.id)}
                  className="text-red-600 text-xs border border-red-600 px-2 py-1 rounded hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )}
</div>


    </div>
  );
}
