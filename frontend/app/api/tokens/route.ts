import {
  connection,
  getSupportedTokens,
  SUPPORTED_TOKENS,
} from "@/app/lib/constants";
import {
  getAccount,
  getAssociatedTokenAddress,
  getMint,
} from "@solana/spl-token";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("get request recieved");
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address") as string;
  console.log("address: ",address);
  const supportedTokens = await getSupportedTokens();
  console.log("tokens/route.ts \nsupportedTokens: ", supportedTokens);
  const balances = await Promise.all(
    supportedTokens.map((token) => {
      getAccountBalance(token, "DSNNFa7wiw4ryvtaKBuKr9o973bn76JgUrB7dVRBxrfi");
    })
  );
  return NextResponse.json({
    tokens: supportedTokens.map((token, index) => ({
      ...token,
      balance: balances[index],
    })),
  });
}

const getAccountBalance = async (
  token: {
    name: string;
    mint: string;
    native: boolean;
  },
  address: string
) => {
  if (token.native) {
    let balance = await connection.getBalance(new PublicKey(token.mint));
    return balance / LAMPORTS_PER_SOL;
  }
  try {
    const ata = await getAssociatedTokenAddress(
      new PublicKey(token.mint),
      new PublicKey(address)
    );
    const account = await getAccount(connection, ata);
    if(!account){
    console.log("no account found");
    return;
    }
    console.log("Account: ",account);
    const mint = await getMint(connection, new PublicKey(token.mint));
    return Number(account.amount) / 10 ** mint.decimals;
  } catch (error) {
    console.log("error coming from route.ts: ",error);
  }
};
