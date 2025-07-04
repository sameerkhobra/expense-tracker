import React from "react";

export default function BalanceCard({ platform, balance }) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center w-full hover:shadow-2xl transition-shadow h-36">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">{platform}</h3>
      <p className="text-3xl font-bold text-green-600">₹ {balance.toFixed(2)}</p>
    </div>
  );
}
