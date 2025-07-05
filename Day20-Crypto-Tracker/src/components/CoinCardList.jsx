import { LineChart, Line, Tooltip, ResponsiveContainer, XAxis } from "recharts";

const CoinCardList = ({ data, currency }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {data.map((coin) => {
        const formattedData = coin.sparkline_in_7d.price.map((p, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (coin.sparkline_in_7d.price.length - i));
          return {
            index: i,
            price: p,
            date: date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
          };
        });

        return (
          <div key={coin.id} className="bg-white/10 p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="text-lg font-bold">{coin.name} ({coin.symbol.toUpperCase()})</div>
              <img src={coin.image} alt={coin.name} className="h-6 w-6" />
            </div>
            <div className="text-sm mb-1">
              Price: {currency.toUpperCase()} {coin.current_price.toLocaleString()}
              <span className={`ml-2 text-xs font-medium ${coin.price_change_percentage_24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                ({coin.price_change_percentage_24h.toFixed(2)}%)
              </span>
            </div>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={formattedData}>
                <XAxis dataKey="date" hide />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
                  labelStyle={{ color: "#a78bfa" }}
                  formatter={(value, name) => [`${currency.toUpperCase()} ${value.toFixed(2)}`, "Price"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#c084fc"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
};

export default CoinCardList;
