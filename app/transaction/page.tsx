"use client";

import { useState } from "react";
import QRCode from "react-qr-code";

export default function TransactionPage() {
  const [value, setValue] = useState("");
  const [qrData, setQrData] = useState("");
  const [loading, setLoading] = useState(false);

  const generateQR = async () => {
    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    setLoading(true);

    try {
      // Replace with actual backend API endpoint
      const response = await fetch("/api/generate-qr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: value }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate QR code");
      }

      const data = await response.json();
      setQrData(data.qrCode); // Backend should return a QR code URL or data
    } catch (error) {
      alert("Error generating QR code. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-lg w-full text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
          💸 Secure Crypto Transaction
        </h1>
        <p className="text-gray-500 mb-6">Enter the transaction amount to generate a payment QR code.</p>

        {/* Amount Input */}
        <div className="mb-4">
          <input
            type="number"
            placeholder="Enter amount (NZDD)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={generateQR}
          className={`w-full bg-blue-600 text-white font-semibold py-3 rounded-lg transition-transform transform hover:scale-105 active:scale-95 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Generating QR Code..." : "Generate QR Code"}
        </button>

        {/* QR Code Display */}
        {qrData && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
            <p className="text-gray-600 text-sm mb-2">Scan to Pay</p>
            <QRCode value={qrData} className="mx-auto" size={180} />
          </div>
        )}
      </div>
    </div>
  );
}
