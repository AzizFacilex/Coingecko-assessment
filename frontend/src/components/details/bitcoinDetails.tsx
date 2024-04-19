// BitcoinDetails.tsx

import React, { useEffect, useState } from "react";
import PriceTable from "./common/priceTable";
import PriceChart from "./common/priceChart";
import { CoinName, PriceData } from "../../lib/types";
import { fetchCoinPriceHistory } from "../../services/coingeckoApi";
import { Divider } from "@mui/material";

const BitcoinDetails: React.FC = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchCoinPriceHistory(CoinName.Bitcoin);
        const formattedData = response.map((item: number[]) => ({
          date: new Date(item[0]),
          price: parseFloat(item[1].toFixed(2)),
        }));
        setPriceData(formattedData);
        setLoading(false);
      } catch (error) {
        console.debug("Error fetching price data:", error);
        setError("An error occurred while fetching data.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mt-8">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="flex flex-col items-center gap-8 ">
          <PriceChart currency={CoinName.Bitcoin} priceData={priceData}/>
          <Divider className="w-1/2"></Divider>
          <PriceTable currency={CoinName.Bitcoin} priceData={priceData} />
        </div>
      )}
    </div>
  );
};

export default BitcoinDetails;
