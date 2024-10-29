"use client";

import { useSession } from "next-auth/react";
import {  SecondaryButton, TertiaryButton } from "../components/Button";
import { useRouter } from "next/navigation";
import { IoAddOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { LuCopy, LuWallet } from "react-icons/lu";
import { useEffect, useState } from "react";
import { TIMEOUT } from "dns";

export default function ProfileCard({publicKey}:{publicKey:string}) {
    const [walletActive, setWalletActive] = useState<string>('Wallet');
  const session = useSession();
  const router = useRouter();
  if (session.status === "loading") {
    // TODO: Add skeleton here.
    return <div>Loading...</div>;
  }
  if (!session.data?.user) {
    router.push("/");
    return null;
  }
  return (
    <div className="p-8 flex justify-center ">
      <div className="flex flex-col items-center w-full max-w-2xl">
        <SelectButtons  />
        <div className="mt-12 w-full p-8 flex flex-col rounded-xl border bg-white bg-opacity-10 border-black shadow-lg">
          <Greeting
            name={session.data?.user?.name ?? ""}
            image={session.data?.user?.image ?? ""}
          />
          <Assets publicKey={publicKey} />
          <AddFunds />
        </div>
      </div>
    </div>
  );
}



export const SelectButtons = () => {
    const [activeWallet, setWalletActive] = useState('Wallet')
  return (
    <div className="flex rounded-full space-x-4 text-lg px-1 py-1 items-center justify-center w-80 bg-white bg-opacity-10  shadow-sm ">
      <button
      onClick={()=>setWalletActive('Wallet')}
        className={`cursor-pointer ${activeWallet==='Wallet'?`bg-black`:""}  text-white font-medium rounded-full py-2 px-4 w-1/2 text-center transition-colors `}
      >
        Wallet
      </button>
      <button 
      onClick={()=>setWalletActive('Apps')}
      className={`cursor-pointer ${activeWallet==='Apps'?`bg-black`:""}  text-white font-medium rounded-full py-2 px-4 w-1/2 text-center transition-colors`}>
        Apps
      </button>
    </div>
  );
};

export const Greeting = ({ name, image }: { name: string; image: string }) => {
  return (
    <div className="flex items-center space-x-6 ">
      <img
        className="rounded-full w-16 h-16 border border-gray-500 shadow-md"
        src={image}
        alt="User Avatar"
      />
      <div className="font-semibold text-3xl text-white ">
        Welcome Back, <span className="font-bold">{name}</span>
      </div>
    </div>
  );
};

export const Assets = ({publicKey}:{publicKey:string}) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = ()=>{
        navigator.clipboard.writeText(publicKey);
        setCopied(true);
    }
    useEffect(()=>{
        if(copied){
            let timeOut= setInterval(()=>setCopied(false),3000);
            return ()=>{
                clearTimeout(timeOut)
            }
        }        
    },[copied])

  return (
    <div className="mt-8">
      <div className="text-sm text-gray-400 mb-2 flex items-center"><LuWallet className="size-4 mr-2"/>DCEX Account Assets</div>
      <div className="flex justify-between items-center py-4 w-full">
        <div className="text-4xl font-bold text-white">$0.00 USD</div>
        {/* TODO: add copy to clipboard functionlity */}
        <button onClick={handleCopy} className="relative text-white bg-white bg-opacity-10  border-2 border-zinc-900 hover:bg-opacity-20 text-sm cursor-pointer  rounded-full px-2 py-1 flex items-center  "><LuCopy className="mr-2"/>Your Wallet Address      {copied&&<div className="absolute z-10 text-green-700 bottom-8 font-bold ">Copied!!</div>}</button>
   
      </div>
      <div className="flex justify-between gap-2 py-4">
        <TertiaryButton>Send</TertiaryButton>
        <TertiaryButton>Add Funds</TertiaryButton>
        <TertiaryButton>Withdraw</TertiaryButton>
        <TertiaryButton>Swap</TertiaryButton>
      </div>
    </div>
  );
};

export const AddFunds = () => {
    const [border, setBorder] = useState('Tokens');
  return (
    <div>
      <div className="flex  space-x-6 border-b-2 border-zinc-700 ">
        <button onClick={()=>setBorder('Tokens')} className={ "border-b-2  px-3 py-2 cursor-pointer"+`${border==='Tokens'?'':' border-b-transparent'}` }>Tokens </button>
        <button onClick={()=>setBorder('NFTs')} className={ "border-b-2   px-3 py-2 cursor-pointer"+`${border==='NFTs'?'':' border-b-transparent'}`}>NFTs</button>
        <button onClick={()=>setBorder('Activity')} className={"border-b-2  px-3 py-2 cursor-pointer"+`${border==='Activity'?'':' border-b-transparent'}` }>Activity </button>
      </div>
      <div className="flex justify-center items-center p-8 flex-col space-y-4">
        <div className="flex flex-col  justify-center items-center text-gray-400">
          <span className="text-xl text-gray-300">You don't have any assets yet!</span>
          <span className="text-sm">Start by buying or depositing funds:</span>
        </div>
        <SecondaryButton prefix={<FaPlus className="size-4 mr-2 " />}>
          Add Funds
        </SecondaryButton>
      </div>
    </div>
  );
};
