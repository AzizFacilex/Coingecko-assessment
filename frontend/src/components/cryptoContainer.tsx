// CryptoContainer.tsx

import { Button } from "@mui/material";
import React, { useState } from "react";
import PurchaseResultModal from "./modal";

interface CryptoContainerProps {
  title: string;
  data: any | null;
  details: React.ReactNode;
}

const CryptoContainer: React.FC<CryptoContainerProps> = ({ title, data, details }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleBuy = () => {
    setShowPurchaseModal(true);
  };

  const handleClose = () => {
    setShowPurchaseModal(false);
  };
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 mb-4">
      <div className="flex justify-between items-center  flex-col md:flex-row gap-4 md:gap-0 ">
        <div className="flex items-center">
          <h2 className=" text-2xl font-semibold mr-2">{title}</h2>
          <span className="text-gray-500 text-xl">Current Price: €{data.eur}</span>
        </div>
        <div className="flex justify-between items-center gap-4">
          <Button variant="contained" color="success" onClick={handleBuy}>
            Buy at Current Price!
          </Button>
          <Button variant="contained" color="primary" onClick={toggleDetails}>
            {showDetails ? "Hide Details" : "Show Details"}
          </Button>
        </div>
      </div>
      {showDetails && details}
      <PurchaseResultModal open={showPurchaseModal} onClose={handleClose} price={data.eur} coin={title} />
    </div>
  );
};

export default CryptoContainer;
