import axios from "axios";

const api = axios.create({
  baseURL: "https://v6.exchangerate-api.com/v6/dc1b5600e649bf3cdf3a2661", 
});

export const currencyConverter = (fromCurrency, toCurrency, amount) => {
  return api.get(`/pair/${fromCurrency}/${toCurrency}/${amount}`);
};
