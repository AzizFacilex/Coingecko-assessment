import { Button, Input, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GppBadIcon from "@mui/icons-material/GppBad";
import { CoinName, PortfolioData } from "../lib/types";
import { savePortfolioEntry } from "../services/backendApi";
import { usePortfolioContext } from "../context/portfolioContext";

interface PurchaseResultModalProps {
  open: boolean;
  onClose: () => void;
  price: number;
  coin: string;
}

const PurchaseResultModal: React.FC<PurchaseResultModalProps> = ({ open, onClose, price, coin }) => {
  const { updateTotalBalance } = usePortfolioContext();
  const [desiredPrice, setDesiredPrice] = useState("");
  const [coinAmount, setCoinAmount] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [validationError, setValidationError] = useState("");

  function resetState() {
    setSuccess(false);
    setError(false);
    setValidationError("");
  }
  useEffect(() => {
    const coinAmount = parseFloat(desiredPrice) / price;
    setCoinAmount(coinAmount);
  }, [desiredPrice, price]);

  const handlePurchase = () => {
    resetState();
    if (!desiredPrice || parseFloat(desiredPrice) <= 0) {
      setError(true);
      setValidationError("Please enter a minimum price to buy.");
      return;
    }
    const portfolioData: PortfolioData = {
      currency: coin,
      amount: coinAmount,
      purchasePrice: price,
      purchaseTime: new Date().toISOString(),
    };

    savePortfolioEntry(portfolioData)
      .then((response) => {
        setSuccess(true);
        setDesiredPrice("")
        updateTotalBalance()
      })
      .catch((error) => {
        console.debug("Error saving portfolio entry:", error);
        setError(true);
        setDesiredPrice("")
      });
  };

  function handleInputChange(value: string): void {
    const parsedValue = value;
    if (parseFloat(parsedValue) >= 0) {
      setDesiredPrice(parsedValue);
    } else {
      setDesiredPrice("");
    }
  }

  const handleClose = () => {
    resetState();
    setDesiredPrice("")
    onClose();
  };

  const CoinIcon = () => {
    return (
      <div className="inline-block">
        {coin === CoinName.Bitcoin && <img src="/bitcoin.svg" alt="Bitcoin Icon" className="w-12 h-12 inline-block" />}
        {coin === CoinName.Ethereum && <img src="/ethereum.svg" alt="Ethereum Icon" className="w-12 h-12 inline-block" />}
      </div>
    );
  };

  const CoinSymbol = () => {
    return coin === CoinName.Bitcoin ? "₿" : "⧫";
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <div className="flex items-center justify-center min-h-screen px-4 md:px-0  text-center">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        <div className="inline-block  bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 align-middle max-w-lg w-full">
          <div className="bg-white px-4 pb-4">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center rounded-full h-24 w-24">
              {success ? (
                <div className="mx-auto flex-shrink-0 flex items-center justify-center rounded-full bg-green-100 h-14 w-14">
                  <CheckCircleIcon fontSize="large" className="text-green-600" aria-hidden="true" />
                </div>
              ) : error ? (
                <div className="mx-auto flex-shrink-0 flex items-center justify-center rounded-full bg-red-100 h-14 w-14">
                  <GppBadIcon fontSize="large" className="text-red-600" aria-hidden="true" />
                </div>
              ) : (
                CoinIcon()
              )}
            </div>
            <div className="text-center">
              <h3
                className="text-2xl font-bold flex justify-center items-center leading-6 text-gray-900"
                id="modal-title"
              >
                {success ? `${coin} successfully bought` : error ? `Error in purchasing ${coin}` : `Purchase ${coin}`}
              </h3>
              <div className="mt-4">
                <p className="text-lg text-gray-500">Current Price: €{price}</p>
                <p className="text-lg text-gray-500">Enter the amount to purchase in Euro</p>
                <Input
                  type="number"
                  inputProps={{ min: "0", step: "any" }}
                  value={desiredPrice}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="mt-2 p-2 border rounded-md w-max"
                  placeholder="Enter desired price (€)"
                />{" "}
                ≡ {isNaN(coinAmount) ? "0.000000" : coinAmount.toFixed(6)} {CoinSymbol()}
                {error && (
                  <p className="bg-red-500 text-white rounded-xl p-2 w-fit m-2">
                    <GppBadIcon fontSize="small" className="text-white" aria-hidden="true" />{validationError ?? `Error occurred while purchasing ${coin}. Please try again.`}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="justify-center py-4 px-6 flex flex-row-reverse gap-4 mb-6">
            <Button size="large" variant="contained" onClick={handlePurchase} color="success">
              Purchase
            </Button>
            <Button size="large" variant="contained" onClick={handleClose} color="error">
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PurchaseResultModal;
