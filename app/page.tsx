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
import { calls } from '@/calls';

import ImageSvg from './svg/Image';
import OnchainkitSvg from './svg/OnchainKit';
import { FundButton } from '@coinbase/onchainkit/fund';
import {useAccount} from "wagmi";
import {baseSepolia} from "viem/chains";
import {useCallback} from "react";

const components = [
  {
    name: 'Transaction',
    url: 'https://onchainkit.xyz/transaction/transaction',
  },
  { name: 'Swap', url: 'https://onchainkit.xyz/swap/swap' },
  { name: 'Checkout', url: 'https://onchainkit.xyz/checkout/checkout' },
  { name: 'Wallet', url: 'https://onchainkit.xyz/wallet/wallet' },
  { name: 'Identity', url: 'https://onchainkit.xyz/identity/identity' },
];

const templates = [
  { name: 'NFT', url: 'https://github.com/coinbase/onchain-app-template' },
  { name: 'Commerce', url: 'https://github.com/coinbase/onchain-commerce-template'},
  { name: 'Fund', url: 'https://github.com/fakepixels/fund-component' },
];

export default function App() {
  const { address } = useAccount();

  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    console.log('LifecycleStatus', status);
  }, []);

  const clickContractAddress = '0x67c97D1FB8184F038592b2109F854dfb09C77C75';
  const clickContractAbi = [
    {
      type: 'function',
      name: 'transfer',
      inputs: [
          {
            type: "address",
            name: "to",
          },

          {
            type: "uint256",
            name: "amount",
          },
      ],
      outputs: [
        {
          type: 'bool',
          name: '',
        }
      ],
      stateMutability: 'nonpayable',
    },
  ] as const;

  const calls = [
    {
      address: clickContractAddress,
      abi: clickContractAbi,
      functionName: 'transfer',
      args: [address, 1000000],
    }
  ];


  return (


      <div className="flex flex-col min-h-screen font-sans dark:bg-background dark:text-white bg-white text-black">
        <header className="pt-4 pr-4">
          <div className="flex justify-end">
            <div className="wallet-container">
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

        <main className="flex-grow flex items-center justify-center">
          <div className="max-w-4xl w-full p-4">
            <div className="w-1/3 mx-auto mb-6">
              <ImageSvg />
            </div>
            <div className="flex justify-center mb-6">
              <a target="_blank" rel="_template" href="https://onchainkit.xyz">
                <OnchainkitSvg className="dark:text-white text-black" />
              </a>
            </div>
            <p className="text-center mb-6">
              Get started by editing
              <code className="p-1 ml-1 rounded dark:bg-gray-800 bg-gray-200">app/page.tsx</code>.
            </p>
            <div className="flex flex-col items-center">
              <div className="max-w-2xl w-full">
                <div className="flex flex-col md:flex-row justify-between mt-4">
                  <div className="md:w-1/2 mb-4 md:mb-0 flex flex-col items-center">
                    {/* Only display components if user is logged in */}
                    {address ? (
                        <>
                          <FundButton />

                          <Transaction
                              chainId={baseSepolia.id}
                              calls={calls}
                              onStatus={handleOnStatus}
                          >
                            <TransactionButton />
                            <TransactionSponsor />
                            <TransactionStatus>
                              <TransactionStatusLabel />
                              <TransactionStatusAction />
                            </TransactionStatus>
                          </Transaction>
                          ) : (
                          <Wallet>
                            <ConnectWallet>
                              <Avatar className='h-6 w-6' />
                              <Name />
                            </ConnectWallet>
                          </Wallet>


                        </>

                    ) : (


                      <p> Connect your wallet to get started! </p>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
}