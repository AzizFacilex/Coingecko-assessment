// Footer.tsx

import React from "react";


const COPYRIGHT_YEAR = new Date().getFullYear();
const COMPANY_NAME = "CoinGecko Assessment";
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 fixed inset-x-0 bottom-0 mt-8">
      <div className="container mx-auto">
        <p className="text-center">&copy; {COPYRIGHT_YEAR} {COMPANY_NAME}</p>
      </div>
    </footer>
  );
};

export default Footer;
