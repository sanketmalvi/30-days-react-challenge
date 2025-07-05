const PortfolioTable = ({ portfolio, totalValue, onSelect }) => {
  return (
    <div className="bg-white/10 rounded-lg p-4 shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Your Portfolio</h2>
      {portfolio.length === 0 ? (
        <p className="text-gray-300">No coins added yet.</p>
      ) : (
        <table className="w-full table-auto text-sm text-left">
          <thead>
            <tr className="text-purple-300">
              <th className="py-2">Coin</th>
              <th>Amount</th>
              <th>Price (USD)</th>
              <th>Total Value</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((coin) => (
              <tr
                key={coin.id}
                className="hover:bg-white/5 cursor-pointer"
                onClick={() => onSelect(coin.id)}
              >
                <td className="py-2 capitalize">{coin.id}</td>
                <td>{coin.amount}</td>
                <td>${coin.price.toLocaleString()}</td>
                <td>${coin.value.toLocaleString()}</td>
              </tr>
            ))}
            <tr className="font-semibold text-purple-200 border-t border-purple-700">
              <td colSpan="3" className="py-2">Total</td>
              <td>${totalValue.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PortfolioTable;
