"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { PrimaryButton } from "./Button";

const AppBar = () => {
  const session = useSession();
  return (
    <div className="w-full ">
      <div className="flex justify-between items-center p-8">
        <div className="font-bold text-2xl text-white">DCEX</div>
        <div>
          {session?.data?.user ? (
            <PrimaryButton
              onClick={() => signOut()}
            >
              Logout
            </PrimaryButton>
          ) : (
            <PrimaryButton
              onClick={() => signIn('google')}
            >
              Login
            </PrimaryButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppBar;
