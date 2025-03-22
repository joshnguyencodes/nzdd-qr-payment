'use client';

import { Suspense, useCallback, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import { baseSepolia } from 'viem/chains';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';

function AppContent() {
  const { address } = useAccount();
  const searchParams = useSearchParams();

  // State for the Help/Instructions modal
  const [showInstructions, setShowInstructions] = useState(false);

  // Retrieve the amount and requester address from URL parameters
  const requestedAmount = searchParams.get('amount');
  const requesterAddress = searchParams.get('address');

  const defaultRecipient = "0xDA34b84D67390cE27e03B898e23C88a92bb8743a";
  const recipientAddress = requesterAddress || defaultRecipient;

  // Contract & transaction setup
  const NZDDContractAddress = '0x0649fFCb4C950ce964eeBA6574FDfDE0478FDA5F';
  const NZDDContractAbi = [
    {
      type: 'function',
      name: 'transfer',
      inputs: [
        { type: "address", name: "to" },
        { type: "uint256", name: "amount" },
      ],
      outputs: [{ type: 'bool', name: '' }],
      stateMutability: 'nonpayable',
    },
  ] as const;

  const one_billion_boolars = 1000000;
  let transferAmount = requestedAmount ? Number(requestedAmount) : 1;
  transferAmount = transferAmount * one_billion_boolars;

  const calls = [
    {
      address: NZDDContractAddress,
      abi: NZDDContractAbi,
      functionName: 'transfer',
      args: [recipientAddress, transferAmount],
    },
  ];
  console.log("Transfer Amount Sent:", calls[0].args[1]);

  const handleOnStatus = useCallback((status) => {
    console.log('LifecycleStatus', status);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-purple-300 to-indigo-300">
      {/* Main container/card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-3xl w-full m-4">

        {/* Header / Nav Bar */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-6">
          {/* Left: QR Code Creation Link */}
          <a
            href="/transaction"
            className="text-white bg-blue-500 px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition-transform transform hover:scale-105 active:scale-95 mb-3 md:mb-0"
          >
            Create your QR code
          </a>

          {/* Right: Wallet Connect */}
          <div className="flex items-center space-x-4">
            <Wallet>
              <ConnectWallet>
                <Avatar className="h-6 w-6" />
                <Name />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownLink
                  icon="wallet"
                  href="https://keys.coinbase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wallet
                </WalletDropdownLink>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
          </div>
        </header>

        {/* Title / Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Crypto Payments Made Easy
          </h1>
          <p className="text-gray-600">
            If you are paying, scan a merchant’s QR code to send crypto securely.
            If you are a merchant, create your QR code using the button above.
          </p>
        </div>

        {/* Payment Section */}
        <div className="flex flex-col items-center">
          {!address && (
            <p className="text-red-600 font-semibold mb-6">
              Connect your wallet to get started!
            </p>
          )}

          {address && (
            <>
              {requestedAmount && requesterAddress ? (
                <div className="flex flex-col items-center justify-center">
                  <Transaction
                    chainId={baseSepolia.id}
                    calls={calls as unknown as any}
                    onStatus={handleOnStatus}
                  >
                    <TransactionButton className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-600 transition-colors">
                      Pay Now
                    </TransactionButton>
                  </Transaction>
                </div>
              ) : (
                <div className="text-center text-gray-700 text-lg">
                  <p className="mb-2 font-semibold">
                    Welcome!
                  </p>
                  <p>
                    To make a payment, please scan a merchant’s QR code.
                  </p>
                  <p className="mt-2">
                    If you are a merchant, click <span className="font-bold">"Create your QR code"</span> above.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Floating Help Button */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => setShowInstructions(true)}
          className="bg-blue-300 text-blue-900 w-10 h-10 rounded-full shadow-lg hover:bg-blue-400 transition-colors"
        >
          ?
        </button>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">How to Use This App</h2>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                &times;
              </button>
            </div>
            <div className="text-gray-700 text-left space-y-2 text-lg leading-relaxed">
              <ol className="list-decimal ml-5 space-y-2">
                <li>
                  <strong>Connect Wallet:</strong> Click the 'Connect Wallet' button in the top-right corner.
                </li>
                <li>
                  <strong>Create QR Code:</strong> If you're a merchant, click "Create your QR code", enter an amount and choose an address, then generate your code.
                </li>
                <li>
                  <strong>Make Payment:</strong> If you're a payer, scan a merchant's QR code to initiate a payment. Your transaction will appear here with a "Pay Now" button.
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppContent />
    </Suspense>
  );
}
