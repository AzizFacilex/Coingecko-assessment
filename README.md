# Cryptocurrency Web Application

This repository contains the implementation of a web application designed to interact with cryptocurrency data, including displaying current prices, price changes, historical data, and a portfolio management system. The application is built using React.js for the frontend and Spring Boot for the backend.

## Use Cases Implemented

1. **Current Price**: Displays the current price in EUR of digital currencies Bitcoin and Ethereum.
2. **Change in One Week**: Shows the percentage change in the current price of Bitcoin and Ethereum compared to a week ago.
3. **Price History Table**: Presents a table with the prices in EUR of Bitcoin and Ethereum between the current date and any other date.
4. **Price Chart**: Includes a chart depicting the price changes in EUR of Bitcoin and Ethereum between the current date and any other date.
5. **Portfolio Management**: Allows users to manage their cryptocurrency portfolio, including adding, updating, deleting entries, retrieving a list of all entries, and calculating the total value of the portfolio in €.

## Technologies Used

- **Frontend Framework**: React.js, TailwindCSS
- **Backend Framework**: Spring Boot
- **API Integration**: CoinGecko API for cryptocurrency price data
- **Database**: in-memory storage
- **Chart Library**: recharts

## Getting Started

### Frontend

To start the frontend, follow these steps:

1. Navigate to the `frontend` directory.
2. Run `npm install` to install dependencies.
3. Run `npm run start` to start the frontend server.

### Backend

To start the backend Spring Boot server:

1. Navigate to the `server` directory.
2. Run the backend server using your preferred method or using `mvn spring-boot:run`

## Directory Structure

- **/frontend**: Contains all frontend-related code.
- **/backend**: Houses all backend code written in Spring Boot.
