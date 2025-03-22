
const NZDDContractAddress = '0x0649fFCb4C950ce964eeBA6574FDfDE0478FDA5F';
const crypto_address = "";
const NZDDContractAbi = [
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

export const calls = [
{
  address: NZDDContractAddress,
  abi: NZDDContractAbi,
  functionName: 'transfer',
  args: [crypto_address, 1],
}
];
