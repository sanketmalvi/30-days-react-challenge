import axios from "axios";

const API_KEY =import.meta.env.REACT_APP_EXCHANGE_RATE_API_KEY;

const api = axios.create({
  baseURL: `https://v6.exchangerate-api.com/v6/${API_KEY}`, 
});

export const currencyConverter = (fromCurrency, toCurrency, amount) => {
  return api.get(`/pair/${fromCurrency}/${toCurrency}/${amount}`);
};
