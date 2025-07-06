// src/App.jsx
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import BalanceCard from "./components/BalanceCard";
import TransactionPage from "./components/List";
import Dashboard from "./components/dashboard";
import BudgetsPage from "./components/budgetpage";

export default function App() {
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/balances")
      .then((res) => res.json())
      .then((data) => setWallets(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen min-w-screen flex flex-col">
      <Header />
      <main className="flex flex-col md:flex-row flex-grow min-h-screen">
        {/* Left side */}
        <div className="flex-1 bg-yellow-300 p-12 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            EXPENSE TRACKER
          </h1>
          <p className="text-xl mb-6 text-gray-800">
            <span className="font-semibold">Believe me </span>
            <br />
            <span className="text-lime-600">
              I know your every transaction!
            </span>
          </p>
          <div className="flex space-x-4">
            <button className="border border-yellow-600 px-4 py-2 rounded hover:bg-yellow-400">
              Learn More
            </button>
            <button className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600">
              Get Started
            </button>
          </div>
        </div>

        {/* Right side */}
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-100">
            Your Balances
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            {wallets.map((wallet) => (
              <BalanceCard
                key={wallet.id}
                accountName={wallet.wallet_name} // ✅ must match your SQL alias!
                amount={wallet.amount}
              />
            ))}
          </div>
        </div>
      </main>

      <div className="min-h-screen bg-yellow-200">
        <TransactionPage />
      </div>
      <div className="min-h-screen bg-yellow-200">
            <Dashboard/>
      </div>
      <div className="min-h-screen bg-yellow-200">
            <BudgetsPage/>
      </div>
    </div>
  );
}
