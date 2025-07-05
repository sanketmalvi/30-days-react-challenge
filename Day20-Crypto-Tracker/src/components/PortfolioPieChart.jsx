import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#a78bfa", "#7c3aed", "#5b21b6", "#c084fc", "#d8b4fe"];

const PortfolioPieChart = ({ portfolio }) => {
  const data = portfolio.map((coin) => ({
    name: coin.id,
    value: coin.value,
  }));

  return (
    <div className="bg-white/10 rounded-lg p-4 shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Portfolio Breakdown</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            dataKey="value"
            isAnimationActive={true}
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioPieChart;
