'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, Suspense } from 'react';
import { useAccount } from 'wagmi';
import { baseSepolia } from 'viem/chains';
// import { Sepolia } from viem/chains;
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
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from '@coinbase/onchainkit/transaction';
import ImageSvg from './svg/Image';
import OnchainkitSvg from './svg/OnchainKit';
import { FundButton } from '@coinbase/onchainkit/fund';

function AppContent() {
  const { address } = useAccount();
  const searchParams = useSearchParams();

  // Retrieve the amount and requester address from the URL query parameters.
  const requestedAmount = searchParams.get('amount');
  const requesterAddress = searchParams.get('address');

  // Fallback values or validations might be needed here.
  const defaultRecipient = "0xDA34b84D67390cE27e03B898e23C88a92bb8743a";
  const recipientAddress = requesterAddress || defaultRecipient;
  const one_billion_boolars = 1000000;
  let transferAmount = requestedAmount ? Number(requestedAmount) : 1;
  transferAmount = transferAmount * one_billion_boolars;

  const handleOnStatus = useCallback((status) => {
    console.log('LifecycleStatus', status);
  }, []);

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

  // Use the dynamic values for the transaction call
  const calls = [
    {
      address: NZDDContractAddress,
      abi: NZDDContractAbi,
      functionName: 'transfer',
      args: [recipientAddress, transferAmount],
    }
  ];
  console.log("Transfer Amount Sent:", calls[0].args[1]);

  return (
      <Suspense fallback={<div>Loading...</div>}>
    <div className="flex flex-col min-h-screen font-sans dark:bg-background dark:text-white bg-white text-black">
      {/* Header */}
      <header className="px-4 py-4 bg-gray-100 dark:bg-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <a
            href="/transaction/"
            className="mb-2 md:mb-0 inline-block px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors duration-200"
          >
            Create your QR code
          </a>
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="flex flex-col items-center">
            <img src="./media/hq720.jpg" alt="Description of the image" />
            <div className="w-1/3 mb-6">
              <ImageSvg />
            </div>
            <div className="flex justify-center mb-6">
              <a target="_blank" rel="noopener noreferrer" href="https://onchainkit.xyz">
                <OnchainkitSvg className="dark:text-white text-black" />
              </a>
            </div>
            <p className="text-center mb-6">
              Get started by editing{' '}
              <code className="p-1 ml-1 rounded dark:bg-gray-800 bg-gray-200">
                app/page.tsx
              </code>.
            </p>

            {/* Payment Button Section */}
            {address ? (
              <div className="flex flex-col items-center space-y-4">
                <FundButton />
                <Transaction
                  chainId={baseSepolia.id}
                  // chainId={11155111}
                  calls={calls as unknown as any}
                  onStatus={handleOnStatus}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <TransactionButton />
                    <TransactionSponsor />
                    <TransactionStatus>
                      <TransactionStatusLabel />
                      <TransactionStatusAction />
                    </TransactionStatus>
                  </div>
                </Transaction>
              </div>
            ) : (
              <p>Connect your wallet to get started!</p>
            )}
          </div>
        </div>
      </main>
    </div>
        </Suspense>
  );
}


export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppContent />
    </Suspense>
  );
}