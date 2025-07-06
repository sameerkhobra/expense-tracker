import { useState, useEffect } from 'react';
import BalanceCard from './BalanceCard';

export default function Balance() {
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/balances')
      .then(res => res.json())
      .then(data => setWallets(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      {wallets.map(wallet => (
        <BalanceCard
          key={wallet.id}
          accountName={wallet.wallet_name}
          amount={wallet.amount}
        />
      ))}
    </div>
  );
}
