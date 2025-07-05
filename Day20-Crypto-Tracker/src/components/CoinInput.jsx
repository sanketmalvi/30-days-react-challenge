import { useState } from "react";

const CoinInput = ({ onAdd }) => {
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");
  const [amount, setAmount] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount > 0) {
      onAdd({ id: selectedCoin, amount: parseFloat(amount) });
      setAmount(0);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/10 rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-4 items-center"
    >
      <select
        value={selectedCoin}
        onChange={(e) => setSelectedCoin(e.target.value)}
        className="px-4 py-2 rounded bg-white text-black shadow"
      >
        <option value="bitcoin">Bitcoin (BTC)</option>
        <option value="ethereum">Ethereum (ETH)</option>
        <option value="solana">Solana (SOL)</option>
        <option value="dogecoin">Dogecoin (DOGE)</option>
        <option value="cardano">Cardano (ADA)</option>
      </select>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="px-4 py-2 rounded bg-white/20 text-white shadow w-40"
      />

      <button
        type="submit"
        className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded shadow"
      >
        Add Coin
      </button>
    </form>
  );
};

export default CoinInput;
