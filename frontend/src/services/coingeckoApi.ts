// coingeckoApi.ts

import axios from "axios";

const api = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
});

const CURRENT_PRICES_CACHE_KEY = "cryptoPricesCache";
const HISTORY_PRICES_CACHE_KEY = "coinPriceHistoryCache";

const cachedCurrentPrices = localStorage.getItem(CURRENT_PRICES_CACHE_KEY);
let cryptoPricesCache: any = cachedCurrentPrices ? JSON.parse(cachedCurrentPrices) : null;

const cachedHistoryPrices = localStorage.getItem(HISTORY_PRICES_CACHE_KEY);
let coinPriceHistoryCache: { [coin: string]: any } = cachedHistoryPrices ? JSON.parse(cachedHistoryPrices) : {};

export const fetchCryptoPrices = async () => {
  try {
    const response = await api.get(`/simple/price?ids=bitcoin,ethereum&vs_currencies=eur`);
    cryptoPricesCache = response.data;
    localStorage.setItem(CURRENT_PRICES_CACHE_KEY, JSON.stringify(cryptoPricesCache));
    return response.data;
  } catch (error) {
    console.debug("Error fetching crypto prices, loading from cache.");
    if (cryptoPricesCache) {
      return cryptoPricesCache;
    }
  }
};

export const fetchCoinPriceLastWeek = async (coin: string) => {
  try {
    const response = await api.get(`/coins/${coin.toLowerCase()}/market_chart`, {
      params: {
        date: "03-12-2023",
        localization: false,
      },
    });
    coinPriceHistoryCache[coin] = response.data.prices;
    localStorage.setItem(HISTORY_PRICES_CACHE_KEY, JSON.stringify(coinPriceHistoryCache));
    return response.data.prices;
  } catch (error) {
    if (coinPriceHistoryCache[coin]) {
      return coinPriceHistoryCache[coin];
    }
  }
};

export const fetchCoinPriceHistory = async (coin: string) => {
  try {
    const response = await api.get(`/coins/${coin.toLowerCase()}/market_chart`, {
      params: {
        vs_currency: "eur",
        days: 365,
      },
    });
    coinPriceHistoryCache[coin] = response.data.prices;
    localStorage.setItem(HISTORY_PRICES_CACHE_KEY, JSON.stringify(coinPriceHistoryCache));
    return response.data.prices;
  } catch (error) {
    if (coinPriceHistoryCache[coin]) {
      return coinPriceHistoryCache[coin];
    }
  }
};
