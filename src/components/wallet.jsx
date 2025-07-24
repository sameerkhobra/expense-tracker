import React, { useEffect, useState } from "react";

export default function WalletsPage() {
  const [wallets, setWallets] = useState([]);
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/wallets")
      .then((res) => res.json())
      .then(setWallets)
      .catch((err) => console.error("Error fetching wallets:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/balances")
      .then((res) => res.json())
      .then(setBalances)
      .catch((err) => console.error("Error fetching balances:", err));
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">💼 My Wallets</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map((wallet) => {
          const balance = balances.find(
            (b) => b.wallet_id === wallet._id
          );

          const amount = balance && !isNaN(parseFloat(balance.amount))
            ? parseFloat(balance.amount).toFixed(2)
            : "0.00";

          return (
            <div
              key={wallet._id}
              className="bg-white rounded-lg shadow p-6 flex flex-col justify-between"
            >
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                {wallet.name || "Unnamed Wallet"}
              </h2>
              <p className="text-gray-600 mb-1">
                Balance: <span className="font-bold">₹ {amount}</span>
              </p>
              <p className="text-gray-500 text-sm">
                Currency: {balance?.currency || "INR"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
