# CoinPulse - NextJS16

A real-time crypto analytics terminal built while following the Next.js 16 Full Course by JavaScript Mastery.
CryptoPulse provides global market statistics, trending tokens, a searchable tokens table, and detailed token pages featuring live prices, interactive charts, and exchange data.
The application is powered by the Binance and CoinMarketCap APIs, enabling real-time, sub-second market data streaming for ultra-low latency price updates and live candlestick charts.

**Course reference:**  
[Build and Deploy a Real Time Crypto Screener & Dashboard App | WebSockets with Next.js](https://youtu.be/-vsh_GxC-vg?si=uvE20sVfqj4cvPoQ)

## Features
- Real-Time Cryptocurrency Tracking
- Cryptocurrency Listings
- Interactive Candlestick Charts 
- Individual Coin Detail Pages 
- Dashboard Overview

## Tech Stack
- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS 4
- Charts: Lightweight Charts library
- APIs: CoinMarketCap, Binance (REST & WebSocket)

## API Endpoints
- `GET /api/events` — Fetch all events (sorted by newest first)
- `GET /api/events/[slug]` — Fetch a single event by its slug
- `POST /api/events` — Create a new event with image upload support

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Installation

**1.** Clone the repository:
```bash
git clone https://github.com/Kerliula/coinpulse-nextjs16.git
cd coinpulse-nextjs16
```
**2.** Install dependencies:
```bash
npm install
# or
yarn install
```
**3.** Copy .env.example to .env and configure your environment variables:
```bash
cp .env.example .env
```
**4.** Start the local development server:
```bash
npm run dev
# or
yarn dev
```
**5.** Open your browser and navigate to:
```bash
http://localhost:3000
```

## ⚠️ Disclaimer
This application is created **for educational and informational purposes only** and does **not** constitute financial advice. Always do your own research before making any investment decisions.

Please note that this project is **experimental and not production-ready**. It was built primarily to **explore and test Next.js features**, and stability, performance, or data accuracy are not guaranteed.

## License
This project is for learning purposes and is open for personal use.
