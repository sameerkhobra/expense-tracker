import React, { useEffect, useState } from "react";
import { format, startOfWeek, endOfWeek } from "date-fns";

export default function TransactionsByWeekPage() {
  const [transactions, setTransactions] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/transactions")
      .then((res) => res.json())
      .then(setTransactions)
      .catch((err) => console.error("Error fetching transactions:", err));
  }, []);

  // Group transactions by week
  const groupedByWeek = transactions.reduce((acc, tx) => {
    const txDate = new Date(tx.date);
    const weekStart = startOfWeek(txDate, { weekStartsOn: 1 }); // Monday
    const weekKey = weekStart.toISOString().split("T")[0];
    if (!acc[weekKey]) acc[weekKey] = [];
    acc[weekKey].push(tx);
    return acc;
  }, {});

  // Convert to sorted week list
  const weeks = Object.keys(groupedByWeek).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  // Transactions for the selected week
  const selectedTransactions = selectedWeek
    ? groupedByWeek[selectedWeek] || []
    : [];

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        📅 Transactions by Week
      </h1>

      {/* Week Selector */}
      <div className="mb-6 text-gray-700">
        <label className="block mb-2 text-gray-700 font-medium">
          Select a Week:
        </label>
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
          className="p-3 border border-gray-300 rounded w-full md:w-1/3"
        >
          <option value="">-- Select Week --</option>
          {weeks.map((week) => (
            <option key={week} value={week}>
              {format(new Date(week), "dd MMM yyyy")} -{" "}
              {format(endOfWeek(new Date(week), { weekStartsOn: 1 }), "dd MMM yyyy")}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Week Transactions */}
      {selectedWeek && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Week:{" "}
            {format(new Date(selectedWeek), "dd MMM yyyy")} -{" "}
            {format(
              endOfWeek(new Date(selectedWeek), { weekStartsOn: 1 }),
              "dd MMM yyyy"
            )}
          </h2>

          {selectedTransactions.length === 0 ? (
            <p className="text-gray-500 italic">No transactions in this week.</p>
          ) : (
            <div className="divide-y divide-gray-200">
              {selectedTransactions.map((tx) => (
                <div key={tx.id} className="py-2 flex justify-between">
                  <div>
                    <p className="text-gray-800 font-medium">
                      ₹ {Number(tx.amount).toFixed(2)}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {tx.description || "-"}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(tx.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!selectedWeek && (
        <p className="text-gray-500 italic">Please select a week above.</p>
      )}
    </div>
  );
}
