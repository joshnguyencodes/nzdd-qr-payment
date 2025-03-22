'use client';

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

import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';
import { FundButton } from '@coinbase/onchainkit/fund';
import { useAccount } from 'wagmi';
import { baseSepolia } from 'viem/chains';
import { useCallback } from 'react';
import { calls } from './calls';
import Image from "next/image";

// const components = [
//   {
//     name: 'Transaction',
//     url: 'https://onchainkit.xyz/transaction/transaction',
//   },
//   { name: 'Swap', url: 'https://onchainkit.xyz/swap/swap' },
//   { name: 'Checkout', url: 'https://onchainkit.xyz/checkout/checkout' },
//   { name: 'Wallet', url: 'https://onchainkit.xyz/wallet/wallet' },
//   { name: 'Identity', url: 'https://onchainkit.xyz/identity/identity' },
// ];
//
// const templates = [
//   { name: 'NFT', url: 'https://github.com/coinbase/onchain-app-template' },
//   { name: 'Commerce', url: 'https://github.com/coin/onchain-commerce-template' },
//   { name: 'Fund', url: 'https://github.com/fakepixels/fund-component' },
// ];

export default function App() {
  const { address } = useAccount();

  const charles_address = "0xDA34b84D67390cE27e03B898e23C88a92bb8743a";
  console.log(charles_address);

  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    console.log('LifecycleStatus', status);
  }, []);

  return (
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
            <Image src="/media/hq720.jpg" alt="Description of the image" width={500} height={500}/>
            {/*<div className="w-1/3 mb-6">*/}
            {/*  <ImageSvg />*/}
            {/*</div>*/}
            {/*<div className="flex justify-center mb-6">*/}
            {/*  <a target="_blank" rel="noopener noreferrer" href="https://onchainkit.xyz">*/}
            {/*    <OnchainkitSvg className="dark:text-white text-black" />*/}
            {/*  </a>*/}
            {/*</div>*/}
            {/*<p className="text-center mb-6">*/}
            {/*  Get started by editing{' '}*/}
            {/*  <code className="p-1 ml-1 rounded dark:bg-gray-800 bg-gray-200">*/}
            {/*    app/page.tsx*/}
            {/*  </code>.*/}
            {/*</p>*/}

            {/* Button Section */}
            {address ? (
              <div className="flex flex-col items-center space-y-4">
                <FundButton />
                <Transaction
                  chainId={baseSepolia.id}
                  calls={calls}
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
  );
}
