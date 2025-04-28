"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { GoPlus } from "react-icons/go";
import { TbMinus } from "react-icons/tb";
import { errorToast, successToast } from "@/components/sonner";
import { axiosInstance } from "@/utils/axios";
import { getTokenCookie } from "@/utils/cookie";
import { EarningRuleType } from "@/utils/interface";
import { appConfig } from "@/configs/appConfig";
import { Loader } from "@/components/loader";

const Products = () => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenCookie, setTokenCookie] = useState<string | null>(null);

  // Function to simulate fetching the token
  const fetchToken = async () => {
    const token = getTokenCookie();
    return token;
  };

  useEffect(() => {
    const checkToken = async () => {
      const fetchedToken = await fetchToken();
      setIsLoading(true);

      if (fetchedToken) {
        setTokenCookie(fetchedToken);
        setIsLoading(false);
      } else {
        // If no token, check again after a delay
        setTimeout(checkToken, 2000); // Check every 2 seconds (adjust as needed)
      }
    };

    checkToken();
  }, []);

  const products = [
    {
      id: "product-1",
      name: "Watch",
      price: 20,
      image: "/images/product-1.jpg",
      currency: "KWD",
    },
  ];

  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1); // Increase quantity
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1); // Decrease quantity (minimum 1)
    }
  };

  const handleBuy = (productId: string) => {
    const product = products.find(({ id }) => id === productId);
    if (!product) {
      errorToast("Product not found");
      return;
    }

    const totalAmount = product.price * quantity;

    setIsLoading(true); // Start loading

    if (tokenCookie) {
      // API call to buy the product (example)
      axiosInstance
        .post(
          "/v1/customers/loyalty-points",
          {
            userExternalId: appConfig.userId,
            loyaltyProgramId: appConfig.loyaltyProgramId,
            amount: totalAmount,
            earningType: EarningRuleType.Redemption,
            reference: product.id,
            additionalInfo: `Purchased a product: ${product.name}`,
          },
          {
            headers: { Authorization: `Bearer ${tokenCookie}` },
          }
        )
        .then(({ data: response }) => {
          console.log(response?.data?.message);
          successToast("Loyalty points added successfully.");
        })
        .catch((error) => {
          errorToast(error?.message ?? "Something went wrong");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <section className="p-6">
      {isLoading ? <Loader /> : null}
      <h2 className="text-xl font-semibold mb-4">Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map(({ id, name, image, price, currency }, index) => (
          <div
            className="max-w-sm mx-auto bg-white rounded-lg shadow-lg overflow-hidden text-black"
            key={`product-${index}`}
          >
            <Image
              className="w-full h-60 object-cover"
              src={image}
              alt={name}
              width={200}
              height={100}
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{name}</h2>
              <p className="text-gray-600 text-sm mb-4">
                Price: {currency} {price}
              </p>
              <div className="flex items-center mb-4">
                <button
                  onClick={handleDecrease}
                  className="bg-gray-300 px-2 py-2 rounded-lg hover:cursor-pointer"
                >
                  <TbMinus size={24} />
                </button>
                <span className="mx-4 text-xl">{quantity}</span>
                <button
                  onClick={handleIncrease}
                  className="bg-gray-300 px-2 py-2 rounded-lg hover:cursor-pointer"
                >
                  <GoPlus size={24} />
                </button>
              </div>
              <p className="text-lg font-semibold mb-4 text-black">
                Total: {currency} {price * quantity}
              </p>
              <button
                onClick={() => handleBuy(id)}
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:cursor-pointer"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Products;
