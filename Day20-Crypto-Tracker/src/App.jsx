import { useEffect, useState } from "react";
import axios from "axios";
import CoinInput from "./components/CoinInput";
import PortfolioTable from "./components/PortfolioTable";
import PriceChart from "./components/PriceChart";
import PortfolioPieChart from "./components/PortfolioPieChart";
import CoinCardList from "./components/CoinCardList";

function App() {
  const [portfolio, setPortfolio] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [coinMarketData, setCoinMarketData] = useState([]);
  const [currency, setCurrency] = useState("usd");

  const fetchPrice = async (id, curr) => {
    const res = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${curr}`
    );
    return res.data[id][curr];
  };

  const handleAddCoin = async (coin) => {
    const price = await fetchPrice(coin.id, currency);
    const coinQuantity = coin.amount / price;
    const newEntry = {
      ...coin,
      price,
      quantity: coinQuantity,
      value: coin.amount,
    };
    setPortfolio((prev) => [...prev, newEntry]);
  };

  const convertPortfolioCurrency = async (newCurrency) => {
    const updated = await Promise.all(
      portfolio.map(async (entry) => {
        const newPrice = await fetchPrice(entry.id, newCurrency);
        return {
          ...entry,
          price: newPrice,
          value: entry.quantity * newPrice,
        };
      })
    );
    setPortfolio(updated);
  };

  const handleCurrencyChange = async (e) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
    await convertPortfolioCurrency(newCurrency);
  };

  const totalValue = portfolio.reduce((acc, c) => acc + c.value, 0);

  const handleCoinSelect = (id) => {
    setSelectedCoin(id);
  };

  useEffect(() => {
    const fetchMarketData = async () => {
      const ids = ["bitcoin", "ethereum", "solana", "dogecoin", "cardano"].join(",");
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${ids}&sparkline=true`
      );
      setCoinMarketData(res.data);
    };
    fetchMarketData();
  }, [currency]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-4">
          <select
            value={currency}
            onChange={handleCurrencyChange}
            className="bg-white text-black px-3 py-1 rounded"
          >
            <option value="usd">USD</option>
            <option value="inr">INR</option>
          </select>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center">💹 Crypto Portfolio Tracker</h1>
        <CoinInput onAdd={handleAddCoin} />
        <CoinCardList data={coinMarketData} currency={currency} />
        <PortfolioTable
          portfolio={portfolio}
          totalValue={totalValue}
          onSelect={handleCoinSelect}
        />
        {portfolio.length > 0 && <PortfolioPieChart portfolio={portfolio} />}
        {selectedCoin && <PriceChart coinId={selectedCoin} />}
      </div>
    </div>
  );
}

export default App;