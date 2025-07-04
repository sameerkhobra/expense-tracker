// src/App.jsx
import React from "react";
import Header from "./components/Header";
import BalanceCard from "./components/balance";
import TransactionPage from "./components/List";

export default function App() {
  const balances = [
    { platform: "Wallet", balance: 1200.50 },
    { platform: "Bank Account", balance: 15300.75 },
    { platform: "UPI", balance: 3500.00 },
    { platform: "Crypto", balance: 25000.00 },
  ];
  return (
    <div className="min-h-screen min-w-screen flex flex-col">
      <Header />
      <main className="flex flex-col md:flex-row flex-grow">
        {/* Left side */}
        <div className="flex-1 bg-yellow-300 p-12 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            EXPENSE TRACKER
          </h1>
          <p className="text-xl mb-6 text-gray-800">
            <span className="font-semibold">Belive me </span>
            <br />
            <span className="text-lime-600">I know your every transaction!</span>
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
         <div className="min-w-2xl bg-gradient-to-b from-yellow-50 to-yellow-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-16 text-gray-800">Your Balances</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {balances.map((item) => (
          <BalanceCard
            key={item.platform}
            platform={item.platform}
            balance={item.balance}
          />
        ))}
      </div>
    </div>
      </main>
        <div>
          <TransactionPage/>
        </div>
    </div>
  );
}
