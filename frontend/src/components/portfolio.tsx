// portfolio.tsx

import { Button } from "@mui/material";
import React, { useState } from "react";
import PortfolioDetails from "./details/portfolioDetails";
import { usePortfolioContext } from "../context/portfolioContext";


const Portfolio: React.FC = () => {
  const { totalBalance } = usePortfolioContext();
    const [showPortfolio, setShowPortfolio] = useState(false);

  const togglePortfolio = () => {
    setShowPortfolio(!showPortfolio);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 mb-4 container md:w-1/2 mx-auto mt-8">
      <div className="flex justify-between items-center flex-col md:flex-row gap-4 md:gap-0 mb-4">
        <div className="flex items-center">
          <h2 className=" text-2xl font-semibold mr-2">Wallet</h2>
        
        </div>
        <span className="text-gray-500 text-xl">
            Total Balance: €{totalBalance?.toFixed(4) ?? '0'}
          </span>
        <Button variant="contained" color="primary" onClick={togglePortfolio}>
          {showPortfolio ? 'Hide Details' : 'Show Details'}
        </Button>
      </div>
      {showPortfolio && <PortfolioDetails></PortfolioDetails>}
    </div>
  );
};

export default Portfolio;
