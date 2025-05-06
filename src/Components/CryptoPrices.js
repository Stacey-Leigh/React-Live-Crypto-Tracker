// ToDo: Change from Line graph to CandleStick Chart

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../App.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CryptoPrices = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
        );
        setCryptoData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleCryptoSelect = (id) => {
    setSelectedCrypto(id);
  };

  const selectedCryptoData = cryptoData.find(
    (crypto) => crypto.id === selectedCrypto
  );

  const chartData = {
    labels: ["1h", "24h", "7d", "30d"],
    datasets: [
      {
        label: `${selectedCryptoData?.name || "Bitcoin"} Price Change (%)`,
        data: [
          selectedCryptoData?.price_change_percentage_1h_in_currency || 0,
          selectedCryptoData?.price_change_percentage_24h || 0,
          selectedCryptoData?.price_change_percentage_7d_in_currency || 0,
          selectedCryptoData?.price_change_percentage_30d_in_currency || 0,
        ],
        borderColor: "#6c5ce7",
        backgroundColor: "rgba(108, 92, 231, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="crypto-tracker">
      <h1>Live Crypto Tracker</h1>
      <div className="crypto-grid">
        {cryptoData.map((crypto) => (
          <div
            key={crypto.id}
            className={`crypto-card ${
              selectedCrypto === crypto.id ? "active" : ""
            }`}
            onClick={() => handleCryptoSelect(crypto.id)}
          >
            <div className="crypto-info">
              <img
                src={crypto.image}
                alt={crypto.name}
                className="crypto-icon"
              />
              <span className="crypto-name">{crypto.name}</span>
            </div>
            <div className="crypto-price">
              ${crypto.current_price.toLocaleString()}
            </div>
            <div
              className={`crypto-change ${
                crypto.price_change_percentage_24h >= 0
                  ? "positive"
                  : "negative"
              }`}
            >
              {crypto.price_change_percentage_24h.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
      <div className="chart-container">
        <h2>{selectedCryptoData?.name || "Bitcoin"} Price Trends</h2>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default CryptoPrices;
