import React, { useState } from "react";

export default function TransactionsTable({ transactions }) {
  const [showTable, setShowTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggle = () => {
    setShowTable(!showTable);
  };

  // ✅ Safe version using optional chaining and default fallback
const filteredTransactions = transactions.filter((tx) => {
  const desc = tx.description?.toLowerCase() || "";
  const cat = tx.category?.toLowerCase() || "";
  const search = searchTerm.toLowerCase();
  return desc.includes(search) || cat.includes(search);
});

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <button
        onClick={handleToggle}
        className="mb-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-full shadow-md transition duration-300"
      >
        {showTable ? "Hide Transactions" : "Show Transactions"}
      </button>

      {showTable && (
        <div className="overflow-x-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">💰 Transactions</h2>

          <input
            type="text"
            placeholder="Search by category or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-6 w-full md:w-1/2 p-3 border border-gray-300 text-gray-800 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          />

          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gradient-to-r from-blue-100 to-blue-200">
              <tr>
                <th className="py-3 px-4 text-left border-b border-gray-300">Date</th>
                <th className="py-3 px-4 text-left border-b border-gray-300">wallet</th>
                <th className="py-3 px-4 text-left border-b border-gray-300">Amount</th>
                <th className="py-3 px-4 text-left border-b border-gray-300">Type</th>
                <th className="py-3 px-4 text-left border-b border-gray-300">Category</th>
                <th className="py-3 px-4 text-left border-b border-gray-300">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id || `${tx.date}-${tx.description}`}
                    className="hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="py-3 px-6 text-sm text-gray-700">{tx.date}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">{tx.wallet_name}</td>

                    <td className="py-3 px-6 text-sm text-green-600 font-semibold">
  {isNaN(Number(tx.amount)) ? "N/A" : `$${Number(tx.amount).toFixed(2)}`}
</td>

                    <td className="py-3 px-6 text-sm capitalize text-gray-700">
                      {tx.type}
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-700">{tx.category}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">{tx.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500 italic">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
