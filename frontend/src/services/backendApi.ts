// backendApi.ts

import axios from "axios";
import { PortfolioData } from "../lib/types";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

export const savePortfolioEntry = (portfolioData: PortfolioData) => {
  return api.post("/portfolio", portfolioData);
};

export const updatePortfolioEntry = (id: number, portfolioData: PortfolioData) => {
  return api.put(`/portfolio/${id}`, portfolioData);
};

export const deletePortfolioEntry = (id: number) => {
  return api.delete(`/portfolio/${id}`);
};

export const getAllPortfolioEntries = () => {
  return api.get("/portfolio");
};

export const getTotalPortfolioValue = () => {
  return api.get("/portfolio/totalValue");
};
