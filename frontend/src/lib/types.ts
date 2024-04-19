// types.ts

export interface PriceData {
  date: Date;
  price: number;
  previousPrice: number;
}

export interface PortfolioData {
  id?: number;
  currency: string;
  amount: number;
  purchasePrice: number;
  purchaseTime?: string;
}

export enum CoinName {
  Bitcoin = "Bitcoin",
  Ethereum = "Ethereum",
}

