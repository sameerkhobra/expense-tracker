// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import TransactionsTable from "./transactions";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF",
  "#FF4560", "#775DD0", "#00E396", "#FEB019", "#FF66C3",
  "#3F51B5", "#03A9F4", "#4CAF50", "#F44336", "#E91E63",
  "#9C27B0", "#673AB7", "#FFC107", "#FF9800"
];

export default function Dashboard() {
  const [balances, setBalances] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/balances")
      .then(res => res.json())
      .then(data => {
        console.log("Balances:", data);
        setBalances(data);
      })
      .catch(err => console.error(err));
  }, []);

 useEffect(() => {
  fetch("http://localhost:5000/expenses-by-category")
    .then(res => res.json())
    .then(data => {
      const formatted = data.map(item => ({
        ...item,
        total_amount: Number(item.total_amount)
      }));
      console.log("Formatted Pie Chart Data:", formatted);
      setCategoryData(formatted);
    })
    .catch(err => console.error(err));
}, []);


  useEffect(() => {
    fetch("http://localhost:5000/transactions")
      .then(res => res.json())
      .then(data => {
        console.log("Transactions:", data);
        setTransactions(data.slice(0, 5));
      })
      .catch(err => console.error(err));
  }, []);

  const totalBalance = balances.reduce((sum, b) => sum + Number(b.amount), 0);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">📊 Dashboard</h1>

      {/* Net Balance */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-700">Net Balance</h2>
        <p className="text-3xl font-bold text-green-600">
          ₹ {totalBalance.toFixed(2)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Expenses by Category
          </h2>
          {categoryData && categoryData.length > 0 ? (
            <PieChart width={400} height={400}>
              <Pie
                data={categoryData}
                dataKey="total_amount"
                nameKey="category_name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <p className="text-gray-500 italic">No expenses to display.</p>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Recent Transactions
          </h2>
          <TransactionsTable transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
