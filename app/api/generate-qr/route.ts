import { NextResponse } from "next/server";

// Mock function to get wallet address from authentication (Replace this with real logic)
const getUserWalletAddress = () => "0x123456789abcdef123456789abcdef12345678";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    // Validate the amount input
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json({ error: "Invalid transaction amount" }, { status: 400 });
    }

    // Get authenticated user's wallet address
    const walletAddress = getUserWalletAddress();
    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address not found" }, { status: 403 });
    }

    // Generate Ethereum Payment QR data
    const qrData = `ethereum:${walletAddress}?amount=${amount}`;

    return NextResponse.json({ qrCode: qrData });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
