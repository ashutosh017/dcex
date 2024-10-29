import ProfileCard from "../components/ProfileCard"
import db from '@/app/db'
import { getServerSession } from "next-auth";
import { authConfig } from "../lib/auth";

const getUserWallet= async ()=>{
    const session = await getServerSession(authConfig);
    const userWallet = await db.solWallet.findFirst({
        where:{
            userId:session?.user?.uid
        },select:{
            publicKey:true
        }
    })
    if(!userWallet){
        return {
            error:"No solana wallet found associated to the user"
        }
    }
    return {
        error:null,
        userWallet
    };
}

export default async ()=>{
    const userWallet = await getUserWallet();
    if(userWallet.error || !userWallet.userWallet?.publicKey){
        return <div>No Solana Wallet Found.</div>
    }

    


    return <div>
        <ProfileCard publicKey={userWallet.userWallet?.publicKey}/>
    </div>
}