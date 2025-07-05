import React, { useState } from "react";
import { useEffect } from "react";

// Dummy categories (replace with backend data later)
const dummyCategories = [
  { id: 1, name: "Food" },
  { id: 2, name: "Rent" },
  { id: 3, name: "Entertainment" },
];



export default function TransactionPage() {
  const [transactions, setTransactions] = useState([]); // empty!

  const [formData, setFormData] = useState({
    amount: "",
    type: "expense",
    category_id: "",
    date: "",
    description: "",
  });

  useEffect(() => {
    fetch("http://localhost:4000/transactions")
      .then((res) => res.json())
      .then((data) =>
        setTransactions(
          data.map((tx) => ({
            ...tx,
            amount: Number(tx.amount), // ✅ always a number
          }))
        )
      )
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddTransaction = async (e) => {
    e.preventDefault();

    const newTx = {
      amount: parseFloat(formData.amount),
      type: formData.type,
      category_id: parseInt(formData.category_id),
      date: formData.date,
      description: formData.description,
    };

    const res = await fetch("http://localhost:4000/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTx),
    });

    const savedTx = await res.json();

    // Optional: update local state
    setTransactions([...transactions, savedTx]);
    setFormData({
      amount: "",
      type: "expense",
      category_id: "",
      date: "",
      description: "",
    });
  };
  const initialCategories = [
    { id: 1, name: "Food" },
    { id: 2, name: "Rent" },
    { id: 3, name: "Entertainment" },
    { id: 4, name: "Utilities" },
    { id: 5, name: "Travel" },
    { id: 6, name: "Health" },
    { id: 7, name: "Education" },
    { id: 8, name: "Shopping" },
    { id: 9, name: "Investment" },
    { id: 10, name: "Gifts" },
    { id: 11, name: "Insurance" },
    { id: 12, name: "Savings" },
    { id: 13, name: "Charity" },
    { id: 14, name: "Subscriptions" },
    { id: 15, name: "Miscellaneous" },
    // ... Add as many as you want
  ];

  // const [categories, setCategories] = useState(initialCategories);

  // useEffect(() => {
  //   fetch("http://localhost:4000/categories")
  //     .then((res) => res.json())
  //     .then((data) => setCategories(data))
  //     .catch((err) => console.error(err));
  // }, []);

  // app.get('/categories', (req, res) => {
  //   db.query('SELECT * FROM Categories', (err, results) => {
  //     if (err) {
  //       console.error(err);
  //       return res.status(500).json({ error: 'Database error' });
  //     }
  //     res.json(results);
  //   });
  // });

  const [categories, setCategories] = useState([]);

 useEffect(() => {
  fetch("http://localhost:4000/categories")
    .then((res) => res.json())
    .then((data) => {
      console.log(data); // Should be an array
      setCategories(data);
    })
    .catch((err) => console.error(err));
}, []);


  return (
    <div className="max-w-4xl mx-auto p-6 ">
      <h1 className="text-3xl font-bold mb-6 text-center text-red-400">
        💰 Add your transactions
      </h1>

      {/* Form */}
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
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="hover:bg-gray-100 transition-colors duration-200"
              >
                <td className="py-3 px-6 text-sm text-gray-700">{tx.date}</td>
                <td className="py-3 px-6 text-sm text-green-600 font-semibold">
                  ${tx.amount.toFixed(2)}
                </td>
                <td className="py-3 px-6 text-sm capitalize text-gray-700">
                  {tx.type}
                </td>
                <td className="py-3 px-6 text-sm text-gray-700">{tx.category}</td>
                <td className="py-3 px-6 text-sm text-gray-700">{tx.description}</td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="py-8 text-center text-gray-500 italic"
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
