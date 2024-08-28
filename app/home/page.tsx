"use client";

import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { LoadingLogo } from "@components/shared/auth/LoadingLogo";
import { api } from "@convex/_generated/api";
import { useConvexAuth, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { user } = useUser();

  if (isLoading) return <LoadingLogo />;

  return (
    <div className="h-screen flex items-center justify-center flex-col gap-y-4">
      <h1 className="text-xl font-semibold"> ようこそ！{isAuthenticated ? user?.fullName : "ゲスト"}さん</h1>
      <div className="flex gap-4">
        {!isAuthenticated ? (
          <SignInButton mode="modal" forceRedirectUrl={"/new"}>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">ログイン</button>
          </SignInButton>
        ) : (
          <SignOutButton>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">ログアウト</button>
          </SignOutButton>
        )}
      </div>
    </div>
  );
}

/* export const Home = () => {

  const store = useMutation(api.users.store);
  const router = useRouter();

  useEffect(() => {
    store({});
    router.push("/new");
  });

  return <LoadingLogo />; 
}; */

//npx shadcn-ui@latest init
//npm install @clerk/nextjs
//npm install convex
