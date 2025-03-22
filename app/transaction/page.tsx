"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";

export default function TransactionPage() {
  const router = useRouter();

  // State for QR generation
  const [value, setValue] = useState("");
  const [qrData, setQrData] = useState("");
  const [loading, setLoading] = useState(false);

  // State for managing crypto addresses
  const [addresses, setAddresses] = useState<
    { name: string; address: string }[]
  >([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [newName, setNewName] = useState("");

  // Function to generate QR code
  const generateQR = async () => {
    // Validate the amount input
    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    // Validate that an address is selected
    if (!selectedAddress) {
      alert("Please select a crypto address.");
      return;
    }

    setLoading(true);
    try {
      // Construct the URL with query parameters.
      // This URL will be scanned and opened in the payer's browser.
      const siteUrl =
        typeof window !== "undefined" ? window.location.origin : "https://nzdd-qr-payment-two.vercel.app";
      const qrUrl = `${siteUrl}/?address=${encodeURIComponent(selectedAddress)}&amount=${encodeURIComponent(value)}`;
      setQrData(qrUrl);
    } catch (error) {
      alert("Error generating QR code. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for QR generation
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await generateQR();
  };

  // Add a new crypto address from the modal
  const addAddress = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newAddress) {
      alert("Please enter an address.");
      return;
    }
    const newEntry = { name: newName || "Unnamed", address: newAddress };
    setAddresses((prev) => [...prev, newEntry]);
    setNewAddress("");
    setNewName("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-lg w-full text-center">
        {/* Back Button */}
        <div className="flex justify-start mb-4">
          <button
            onClick={() => router.push("/")}
            className="text-blue-600 hover:underline font-semibold"
          >
            &larr; Back to Home
          </button>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
          💸 Secure Crypto Transaction
        </h1>
        <p className="text-gray-500 mb-6">
          Enter the transaction amount to generate a payment QR code.
        </p>

        {/* Dropdown for selecting a crypto address (if any exist) */}
        {addresses.length > 0 && (
          <div className="mb-4">
            <label
              htmlFor="address-select"
              className="block text-gray-700 mb-1"
            >
              Select Crypto Address:
            </label>
            <select
              id="address-select"
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">-- Select an address --</option>
              {addresses.map((addr, index) => (
                <option key={index} value={addr.address}>
                  {addr.name}: {addr.address}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Button to open the modal for managing addresses */}
        <div className="mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg transition-transform transform hover:scale-105 active:scale-95"
          >
            Manage Crypto Addresses
          </button>
        </div>

        {/* Form for QR code generation */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
            <input
              type="number"
              placeholder="Enter amount (NZDD)"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white font-semibold py-3 rounded-lg transition-transform transform hover:scale-105 active:scale-95 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Generating QR Code..." : "Generate QR Code"}
          </button>
        </form>

        {/* Display the generated QR Code */}
        {qrData && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
            <p className="text-gray-600 text-sm mb-2">Scan to Pay</p>
            <QRCode value={qrData} className="mx-auto" size={180} />
          </div>
        )}
      </div>

      {/* Modal for adding new crypto addresses */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Manage Crypto Addresses</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                &times;
              </button>
            </div>
            <form onSubmit={addAddress}>
              <div className="mb-4">
                <label
                  htmlFor="crypto-name"
                  className="block text-gray-700 mb-1"
                >
                  Name (optional):
                </label>
                <input
                  id="crypto-name"
                  type="text"
                  placeholder="e.g., Main Wallet"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="crypto-address"
                  className="block text-gray-700 mb-1"
                >
                  Crypto Address:
                </label>
                <input
                  id="crypto-address"
                  type="text"
                  placeholder="Enter crypto address"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg transition-transform transform hover:scale-105 active:scale-95"
              >
                Add Address
              </button>
            </form>
            {addresses.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Saved Addresses:</h3>
                <ul className="max-h-40 overflow-y-auto">
                  {addresses.map((addr, index) => (
                    <li key={index} className="text-gray-700">
                      {addr.name}: {addr.address}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
