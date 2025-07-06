export default function BalanceCard({ accountName, amount }) {
  const displayName = accountName?.trim() || "Unnamed Wallet";
  const displayAmount = isNaN(amount) ? 0 : Number(amount).toFixed(2);

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center w-full h-36 hover:shadow-2xl transition-shadow">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">
        {displayName}
      </h3>
      <p className="text-3xl font-bold text-green-600">
        ₹ {displayAmount}
      </p>
    </div>
  );
}
