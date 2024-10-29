'use client'

import { signIn, useSession } from "next-auth/react"
import { SecondaryButton } from "./Button"
import { useRouter } from "next/navigation"
import { FaGoogle } from "react-icons/fa"

export const Hero = ()=>{
    const signIn1 = (x:string)=>{
        console.log("clicked")
    }
    const session = useSession();
    const router = useRouter();
    return <div className="flex flex-col  justify-center items-center px-2">
        <div className="text-2xl text-center md:text-4xl lg:text-6xl font-medium  ">
            <span>The Indian Cryptocurrency</span>
            <span className="text-blue-700 pl-3">Revolution</span>
        </div  >
       <div className="text-center  ">
       <div className="text-base md:text-xl lg:text-2xl text-gray-400 font-medium pt-4 text-center">
            Create a frictionless wallet from India with just a Google Account.
        </div>
        <div className="text-xs md:text-base lg:text-xl text-gray-400 font-medium pt-2 text-center">
        Convert your INR into Cryptocurrency.
        </div>
       </div>
        <div className="flex justify-center mt-8 ">
            {session?.data?.user?
        <SecondaryButton onClick={()=>{router.push('/dashboard')}}>Go to dashboard</SecondaryButton>
        :
        <SecondaryButton prefix={<FaGoogle className="size-5 mr-4"/>} onClick={()=>{signIn("google")}}>Sign Up with Google</SecondaryButton>

    }
        </div>
    </div>
}