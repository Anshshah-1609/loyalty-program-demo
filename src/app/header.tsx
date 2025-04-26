"use client";

import { useEffect, useState } from "react";
import { IoMdPerson } from "react-icons/io";
import Link from "next/link";
import { axiosInstance } from "@/utils/axios";
import { getTokenCookie, setTokenCookie } from "@/utils/cookie";
import { appConfig } from "@/configs/appConfig";

export default function Header() {
  const [tokenFetched, setTokenFetched] = useState(false);

  useEffect(() => {
    const token = getTokenCookie();
    if (!token) {
      axiosInstance
        .post("/v1/auth/generate-client-token", {
          clientId: appConfig.clientId,
          clientSecret: appConfig.clientSecret,
        })
        .then(({ data: response }) => {
          setTokenCookie(response.data.accessToken);
          setTokenFetched(true); // Once token is fetched, set this to true
        });
    } else {
      setTokenFetched(true); // If token is already present, set this to true
    }
  }, []);

  return (
    <header className="bg-gray-800 text-white flex justify-between items-center py-4 px-16">
      <div className="flex flex-row justify-center items-center gap-14">
        <Link href="/" className="text-2xl font-bold">
          Loyalty Program
        </Link>
        {/* Only render Products link if token is fetched */}
        {tokenFetched && (
          <Link href="/products" className="text-xl">
            Products
          </Link>
        )}
      </div>
      <nav className="flex items-center space-x-6 ml-auto">
        <div className="flex items-center space-x-6">
          {/* Only render Loyalty Points link if token is fetched */}
          {tokenFetched && (
            <Link href="/loyalty" className="text-blue-400 text-xl">
              Loyalty Points
            </Link>
          )}
          <div className="flex flex-row justify-center items-center gap-2">
            <IoMdPerson size={16} />
            <span className="mr-2">Peter Anderson</span>
          </div>
        </div>
      </nav>
    </header>
  );
}
