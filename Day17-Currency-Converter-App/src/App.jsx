import { useState } from "react";
import InputBox from "./components/InputBox";
import { currencyConverter } from "./api/postApi";

function App() {
  const [amount, setAmount] = useState(0);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
    setConvertedAmount(null);
  };

  const handleConvert = async () => {
    if (amount <= 0) return;
    setLoading(true);
    setError(null);
    setConvertedAmount(null);

    try {
      const res = await currencyConverter(from, to, amount);
      console.log("API Response:", res.data);

      if (res.data.result !== "success") {
        throw new Error("Conversion failed");
      }

      setConvertedAmount(res.data.conversion_result);
    } catch (err) {
      console.error(err);
      setError("Error fetching conversion rate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full h-screen flex flex-wrap justify-center items-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
      }}
    >
      <div className="w-full">
        <div className="w-full max-w-md mx-auto border border-gray-60 rounded-lg p-5 backdrop-blur-sm bg-white/30">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleConvert();
            }}
          >
            <div className="w-full mb-1">
              <InputBox
                label="From"
                amount={amount}
                onAmountChange={(value) => setAmount(value)}
                currencyOptions={["USD", "INR", "EUR", "GBP", "AUD"]}
                selectCurrency={from}
                onCurrencyChange={(currency) => setFrom(currency)}
              />
            </div>

            <div className="relative w-full h-0.5">
              <button
                type="button"
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-md bg-blue-600 text-white px-2 py-0.5"
                onClick={swapCurrencies}
              >
                Swap
              </button>
            </div>

            <div className="w-full mt-1 mb-4">
              <InputBox
                label="To"
                amount={convertedAmount ? convertedAmount.toFixed(2) : ""}
                amountDisable
                currencyOptions={["USD", "INR", "EUR", "GBP", "AUD"]}
                selectCurrency={to}
                onCurrencyChange={(currency) => setTo(currency)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg"
              disabled={loading}
            >
              {loading ? "Converting..." : `Convert ${from} to ${to}`}
            </button>

            {convertedAmount !== null && (
              <p className="text-center mt-4 text-lg font-semibold text-white">
                {amount} {from} = {convertedAmount.toFixed(2)} {to}
              </p>
            )}

            {error && <p className="text-red-600 mt-2">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
