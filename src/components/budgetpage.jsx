// src/pages/BudgetsPage.jsx
import React, { useEffect, useState } from "react";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [formData, setFormData] = useState({
    category_id: "",
    amount: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [categories, setCategories] = useState([]);

  // Fetch budgets
  useEffect(() => {
    fetch("http://localhost:5000/budgets")
      .then((res) => res.json())
      .then((data) => {
        console.log("Budgets:", data);
        setBudgets(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch categories for dropdown
  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newBudget = {
      category_id: parseInt(formData.category_id),
      amount: parseFloat(formData.amount),
      month: parseInt(formData.month),
      year: parseInt(formData.year),
    };

    const res = await fetch("http://localhost:5000/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBudget),
    });

    const saved = await res.json();
    console.log("Saved budget:", saved);
    setBudgets([...budgets, saved]);
    setFormData({ ...formData, amount: "", category_id: "" });
  };

  const handleEdit = async (id, newAmount) => {
    const res = await fetch(`http://localhost:5000/budgets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseFloat(newAmount) }),
    });

    const updated = await res.json();
    console.log("Updated budget:", updated);
    setBudgets(
      budgets.map((b) => (b.id === id ? { ...b, amount: updated.amount } : b))
    );
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">📅 Budgets</h1>

      {/* Add Budget */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8">
  <h2 className="text-xl font-semibold mb-4 text-gray-900">
    Add New Budget
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <select
      name="category_id"
      value={formData.category_id}
      onChange={handleChange}
      required
      className="p-3 border border-gray-300 rounded text-gray-900"
    >
      <option value="">Select Category</option>
      {categories.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>

    <input
      name="amount"
      type="number"
      step="0.01"
      placeholder="Budget Amount"
      value={formData.amount}
      onChange={handleChange}
      required
      className="p-3 border border-gray-300 rounded text-gray-900 placeholder-gray-600"
    />

    <input
      name="month"
      type="number"
      min="1"
      max="12"
      value={formData.month}
      onChange={handleChange}
      className="p-3 border border-gray-300 rounded text-gray-900"
    />

    <input
      name="year"
      type="number"
      value={formData.year}
      onChange={handleChange}
      className="p-3 border border-gray-300 rounded text-gray-900"
    />
  </div>

  <button
    type="submit"
    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded"
  >
    Add Budget
  </button>
</form>


      {/* Budgets Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Current Budgets
        </h2>
       <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
  <h2 className="text-xl font-semibold mb-4 text-gray-700">
    Current Budgets
  </h2>
  <table className="min-w-full border border-gray-200 text-left">
    <thead className="bg-blue-50 text-gray-700 uppercase text-sm">
      <tr>
        <th className="py-3 px-5 border-b">Category</th>
        <th className="py-3 px-5 border-b">Budgeted</th>
        <th className="py-3 px-5 border-b">Spent</th>
        <th className="py-3 px-5 border-b">Progress</th>
        {/* <th className="py-3 px-5 border-b">Edit</th> */}
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      {budgets.map((b) => (
        <tr key={b.id} className="hover:bg-gray-50">
          <td className="py-3 px-5 text-gray-800">{b.category_name}</td>
          <td className="py-3 px-5 text-gray-800 font-medium">
            ₹ {Number(b.amount).toFixed(2)}
          </td>
          <td className="py-3 px-5 text-gray-800 font-medium">
            ₹ {Number(b.spent).toFixed(2)}
          </td>
          <td className="py-3 px-5 w-1/3">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${
                  b.spent > b.amount ? "bg-red-500" : "bg-green-500"
                }`}
                style={{
                  width: `${
                    b.amount > 0
                      ? Math.min((b.spent / b.amount) * 100, 100)
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </td>
     

        </tr>
      ))}
    </tbody>
  </table>
</div>

      </div>
    </div>
  );
}
