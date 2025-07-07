// src/pages/ReportsPage.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import FutureExpenditurePage from "./futureexp";

export default function ReportsPage() {
  const [transactions, setTransactions] = useState([]);
  const [categorySummary, setCategorySummary] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/transactions")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000/expenses-by-category")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item) => ({
          ...item,
          total_amount: Number(item.total_amount),
        }));
        setCategorySummary(formatted);
      })
      .catch((err) => console.error(err));
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netBalance = totalIncome - totalExpenses;

  // ✅ Generate expenses-over-time data using transactions
  const expensesOverTime = transactions
    .filter((t) => t.type === "expense")
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((exp) => ({
      date: new Date(exp.date).toLocaleDateString(),
      amount: Number(exp.amount),
    }));

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        📈 Financial Report
      </h1>

      {/* Summary Chart: Expenses Over Time */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Expenses Over Time
        </h2>

        {expensesOverTime.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={expensesOverTime}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#EF4444"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 italic">No expense data available.</p>
        )}
      </div>

      {/* Bar Chart: Expenses by Category */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Expenses by Category
        </h2>
        {categorySummary.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categorySummary}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category_name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="total_amount"
                fill="#8884d8"
                name="Amount Spent"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 italic">No category data available.</p>
        )}
      </div>

      {/* Transactions Timeline */}
      <FutureExpenditurePage />
    </div>
  );
}
