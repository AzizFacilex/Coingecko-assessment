import "./App.css";
import BitcoinDetails from "./components/details/bitcoinDetails";
import CryptoContainer from "./components/cryptoContainer";
import EthereumDetails from "./components/details/ethereumDetails";
import Footer from "./layouts/footer";
import Header from "./layouts/header";
import { useState, useEffect } from "react";
import { fetchCryptoPrices } from "./services/coingeckoApi";
import Portfolio from "./components/portfolio";
import { CoinName } from './lib/types';

function App() {
  const [cryptoData, setCryptoData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCryptoPrices();
        setCryptoData(data);
        setLoading(false);
      } catch (error) {
        console.debug("Error fetching crypto data:", error);
        setError("An error occurred while fetching data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Header title="CoinGecko Assessment" />
      <div>
        <div className="px-4 md:px-0">
        <Portfolio></Portfolio>

        </div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className="container mx-auto mt-8 mb-32 px-4 mb:mx-auto">
              <CryptoContainer title={CoinName.Bitcoin} data={cryptoData.bitcoin} details={<BitcoinDetails />} />
              <CryptoContainer title={CoinName.Ethereum} data={cryptoData.ethereum} details={<EthereumDetails />} />
            </div>
          )}
      </div>
      <Footer />
    </div>
  );
}
export default App;
