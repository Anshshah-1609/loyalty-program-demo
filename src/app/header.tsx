"use client";

import { useEffect } from "react";
import { IoMdPerson } from "react-icons/io";
import Link from "next/link";
import { axiosInstance } from "@/utils/axios";
import {
  getTokenCookie,
  setTokenCookie,
  setUserIdCookie,
} from "@/utils/cookie";
import { appConfig } from "@/configs/appConfig";

export default function Header() {
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
        });
    }
  }, []);
  useEffect(() => {
    setUserIdCookie("USR202504247890");
  }, []);

  return (
    <header className="bg-gray-800 text-white flex justify-between items-center py-4 px-16">
      <div className="flex flex-row justify-center items-center gap-14">
        <Link href="/" className="text-2xl font-bold">
          Loyalty Program
        </Link>
        <Link href="/products" className="text-xl">
          Products
        </Link>
      </div>
      <nav className="flex items-center space-x-6 ml-auto">
        <div className="flex items-center space-x-6">
          <Link href="/loyalty" className="text-blue-400 text-xl">
            Loyalty Points
          </Link>
          <div className="flex flex-row justify-center items-center gap-2">
            <IoMdPerson size={16} />
            <span className="mr-2">Peter Anderson</span>
          </div>
        </div>
      </nav>
    </header>
  );
}
