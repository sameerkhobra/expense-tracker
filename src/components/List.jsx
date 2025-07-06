import React, { useState, useEffect } from "react";
import TransactionsTable from "./transactions";

export default function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [wallets, setWallets] = useState([]);

  // ✅ Fetch categories
  useEffect(() => {
    fetch("http://localhost:4000/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  // ✅ Fetch wallets for the wallet <select>
 useEffect(() => {
  fetch("http://localhost:4000/wallets")
    .then(res => res.json())
    .then(data => {
      console.log("Wallets API response:", data); // See this in console!
      setWallets(data);
    })
    .catch(err => console.error(err));
}, []);


  // ✅ Fetch transactions
  useEffect(() => {
    fetch("http://localhost:4000/transactions")
      .then((res) => res.json())
      .then((data) =>
        setTransactions(
          data.map((tx) => ({
            ...tx,
            amount: Number(tx.amount),
          }))
        )
      )
      .catch((err) => console.error(err));
  }, []);

  const [formData, setFormData] = useState({
    amount: "",
    type: "expense",
    category_id: "",
    wallet_id: "",
    date: "",
    description: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddTransaction = async (e) => {
    e.preventDefault();

    const newTx = {
      amount: parseFloat(formData.amount),
      type: formData.type,
      category_id: parseInt(formData.category_id),
      wallet_id: parseInt(formData.wallet_id),
      date: formData.date,
      description: formData.description,
    };

    const res = await fetch("http://localhost:4000/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTx),
    });

    const savedTx = await res.json();

    setTransactions([...transactions, savedTx]);
    setFormData({
      amount: "",
      type: "expense",
      category_id: "",
      wallet_id: "",
      date: "",
      description: "",
    });
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-red-400">
          💰 Add your transactions
        </h1>

        <form
          onSubmit={handleAddTransaction}
          className="bg-yellow-300 shadow-md rounded-lg p-6 mb-8"
        >
          <h2 className="text-xl font-semibold mb-4 text-white-900">
            Add Transaction
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
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
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
            name="wallet_id"
            value={formData.wallet_id}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Wallet</option>
            {wallets.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.name}
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
      </div>

      <div className="max-w-4xl mx-auto my-8 p-6 bg-amber-200 rounded-xl shadow-lg border border-amber-400">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          📊 Transaction History
        </h1>
        <TransactionsTable transactions={transactions} />
      </div>
    </div>
  );
}
