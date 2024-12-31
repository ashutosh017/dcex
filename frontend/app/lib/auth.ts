import db from "@/app/db";
import GoogleProvider from "next-auth/providers/google";
import { Keypair } from "@solana/web3.js";
import { Session } from "next-auth";
interface session extends Session {
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
    uid: string;
  };
}
export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET??"next-secret",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "secret",
    }),
  ],
  callbacks: {
    session: ({ session, token }: any): session => {
      const newSession: session = session as session;
      if (newSession.user && token.uid) {
        // @ts-ignore
        newSession.user.uid = token.uid ?? "";
      }
      return newSession;
    },
    async jwt({ token, account, profile }: any) {
      try {
        const user = await db.user.findFirst({
          where: {
            sub: account?.providerAccountId ?? " ",
          },
        });
        if (user) {
          token.uid = user.id;
        }
        return token;
      } catch (e) {
        console.log("jwt error: ", e);
      }
    },
    async signIn({ user, account, profile, email, credentials }: any) {
      console.log({
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      });
      console.log(user, account, profile, email, credentials);
      if (account?.provider === "google") {
        const email = user.email;
        if (!email) return false;
        const userDb = await db.user.findFirst({
          where: {
            username: email,
          },
        });
        if (userDb) return true;
        const keypair = Keypair.generate();
        const publicKey = keypair.publicKey.toBase58();
        const privateKey = keypair.secretKey.toString();
        await db.user.create({
          data: {
            username: email,
            name: profile?.name,
            // @ts-ignore
            profilePicture: profile?.picture,
            sub: account.providerAccountId,
            provider: "Google",
            solWallet: {
              create: {
                publicKey,
                privateKey,
              },
            },
            inrWallet: {
              create: {
                balance: 0,
              },
            },
          },
        });
        return true;
      }

      return false;
    },
  },
};
