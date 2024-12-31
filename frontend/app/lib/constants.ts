import { Connection } from "@solana/web3.js";
import axios from "axios";
import prisma from "../db";

const api =
  "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=5000&convert=USD";
const COIN_MARKETCAP_API_KEY = process.env.CMC_PRO_API_KEY;
let prices: { [key: string]: { name: string; price: number } } = {}; 
let TOKEN_PRICE_REFRESH_INTERVAL = 60 * 1000; // 60s
let LAST_UPDATED: number | undefined;

export const SUPPORTED_TOKENS = [
  {
    name: "USDC",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    native: false,
    price: "1",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvSxrpym7ij1Hf6zQOltcDORlrJGyj1kPf3A&s",
  },
  {
    name: "USDT",
    mint: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    native: false,
    price: "1",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbBMfDxr1PrxlKVnOBktTGlNgXSVYUT0LB7Q&s",
  },
  {
    name: "SOL",
    mint: "So11111111111111111111111111111111111111112",
    native: true,
    price: "180",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTOOhDi1KrwwS7G_H1yvSkMoiPhO3anGP8_w&s",
  },
];

export const connection = new Connection("https://api.mainnet-beta.solana.com");

export async function getSupportedTokens() {
  if (
    !LAST_UPDATED ||
    new Date().getTime() - LAST_UPDATED > TOKEN_PRICE_REFRESH_INTERVAL
  ) {
    try {
      const response = await axios.get(api, {
        headers: {
          "X-CMC_PRO_API_KEY": COIN_MARKETCAP_API_KEY,
        },
      });

      response.data.data.forEach(
        (d: {
          name: string;
          quote: {
            USD: {
              price: number;
            };
          };
        }) => {
          if (["Solana", "USDC", "Tether USDt"].includes(d.name)) {
            prices[d.name] = {
              name: d.name,
              price: d.quote.USD.price,
            };
          }
        }
      );
      console.log("prices: ",prices);

      LAST_UPDATED = new Date().getTime();
    } catch (error) {
      console.error("Error fetching token prices:", error);
    }
  }

  return SUPPORTED_TOKENS.map((s: any) => ({
    ...s,
    price: prices[s.name]?.price || s.price, 
  }));
}
