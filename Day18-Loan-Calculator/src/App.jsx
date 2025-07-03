import { useState } from "react";
import InputField from "./components/InputField";
import BreakdownChart from "./charts/BreakdownChart";
import BarChartComponent from "./charts/BarChartComponent";
import AmortizationTable from "./components/AmortizationTable";

function App() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(8);
  const [tenure, setTenure] = useState(12);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [amortization, setAmortization] = useState([]);
  const [showBarChart, setShowBarChart] = useState(false);

  const calculateEMI = () => {
    const principal = Number(loanAmount);
    const rate = Number(interestRate) / (12 * 100);
    const n = Number(tenure);

    const emiCalc = (principal * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
    const totalPay = emiCalc * n;
    const totalInt = totalPay - principal;

    setEmi(emiCalc.toFixed(2));
    setTotalInterest(totalInt.toFixed(2));
    setTotalPayment(totalPay.toFixed(2));

    // Generate Amortization Table
    let balance = principal;
    let schedule = [];

    for (let i = 1; i <= n; i++) {
      const interest = balance * rate;
      const principalComponent = emiCalc - interest;
      balance -= principalComponent;

      schedule.push({
        month: i,
        emi: emiCalc.toFixed(2),
        principal: principalComponent.toFixed(2),
        interest: interest.toFixed(2),
        balance: balance > 0 ? balance.toFixed(2) : "0.00",
      });
    }

    setAmortization(schedule);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-500 via-blue-400 to-purple-400 p-4">
      <div className="w-full max-w-4xl bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/30">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          🏦 Elegant EMI Calculator
        </h1>

        <div className="grid md:grid-cols-3 gap-4">
          <InputField label="💰 Loan Amount" value={loanAmount} onChange={setLoanAmount} />
          <InputField label="📈 Annual Interest Rate (%)" value={interestRate} onChange={setInterestRate} />
          <InputField label="⏳ Tenure (in months)" value={tenure} onChange={setTenure} />
        </div>

        <button
          onClick={calculateEMI}
          className="w-full mt-5 bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-700 transition"
        >
          Calculate EMI
        </button>

        {emi > 0 && (
          <div className="mt-6 bg-white/30 rounded-xl p-5 text-white shadow-md">
            <p className="text-lg font-semibold">📤 EMI: ₹{emi}</p>
            <p className="mt-1">💸 Total Interest: ₹{totalInterest}</p>
            <p className="mt-1">🧾 Total Payment: ₹{totalPayment}</p>

            {/* Chart Toggle */}
            <div className="flex justify-end mb-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showBarChart}
                  onChange={() => setShowBarChart(!showBarChart)}
                />
                Show Bar Chart
              </label>
            </div>

            {showBarChart ? (
              <BarChartComponent
                principal={loanAmount}
                interest={totalInterest}
              />
            ) : (
              <BreakdownChart
                principal={loanAmount}
                interest={totalInterest}
              />
            )}

            {/* Amortization Table */}
            <AmortizationTable data={amortization} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
