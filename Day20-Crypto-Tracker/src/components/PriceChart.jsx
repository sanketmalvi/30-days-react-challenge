import { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const PriceChart = ({ coinId }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchMarketChart = async () => {
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`
      );
      const formatted = res.data.prices.map(([timestamp, price]) => ({
        date: new Date(timestamp).toLocaleDateString(),
        price: +price.toFixed(2),
      }));
      setChartData(formatted);
    };

    fetchMarketChart();
  }, [coinId]);

  return (
    <div className="bg-white/10 rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-semibold mb-4 capitalize">{coinId} - Last 7 Days</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="date" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#a78bfa" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
