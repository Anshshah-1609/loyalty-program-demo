"use client";

import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  flexRender,
  PaginationState,
  OnChangeFn,
} from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { HeaderCell } from "@/components/HeaderCell";
import { CountUp } from "@/components/CountUp";
import { CopyIcon } from "@/components/CopyIcon";
import Modal from "@/components/Modal";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { errorToast, successToast } from "@/components/sonner";
import { Loader } from "@/components/loader";
import {
  EarningRuleType,
  LoyaltyPointType,
  type LoyaltyPoints,
} from "@/utils/interface";
import { dayMonthYearFormatter, getFormattedAmount } from "@/utils/helper";
import { getTokenCookie } from "@/utils/cookie";
import { axiosInstance } from "@/utils/axios";
import { appConfig } from "@/configs/appConfig";

const LoyaltyPointsHistory = () => {
  const [pointsData, setPointsData] = useState<LoyaltyPoints[]>([]);
  const [page, setPage] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isPointsLoading, setIsPointsLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    lifeTimeCollectedPoints: 0,
    redeemedPoints: 0,
    currentAvailablePoints: 0,
  });
  const [openModal, setOpenModal] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState<number>();
  const [amount, setAmount] = useState<number>();
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({
    pointsToRedeem: "",
    additionalInfo: "",
    amount: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [redeemPointsRes, setRedeemPointsRes] = useState<{
    discountedAmount: number;
    currency: string;
  } | null>(null);
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
        // Once token is found, trigger your API calls
        fetchPointsHistory();
        fetchStatistics();
      } else {
        // If no token, check again after a delay
        setTimeout(checkToken, 2000); // Check every 2 seconds (adjust as needed)
      }
    };

    checkToken();
  }, []);

  useEffect(() => {
    if (redeemPointsRes?.discountedAmount && redeemPointsRes?.currency) {
      setIsSuccess(true);
    }
  }, [redeemPointsRes]);

  const fetchPointsHistory = () => {
    // Fetch points history logic
    if (tokenCookie) {
      setIsPointsLoading(true);

      axiosInstance
        .get(
          `/v1/customers/${appConfig.userId}/loyalty-points?page=${
            page.pageIndex + 1
          }&limit=${page.pageSize}`,
          {
            headers: { Authorization: `Bearer ${tokenCookie}` },
          }
        )
        .then(({ data: response }) => {
          setPointsData(response.data.points);
        })
        .finally(() => {
          setIsPointsLoading(false); // Stop loading when done
        });
    }
  };

  useEffect(() => {
    fetchPointsHistory();
  }, [page, tokenCookie]);

  const fetchStatistics = async () => {
    // Fetching statistics data
    if (tokenCookie) {
      setIsLoading(true);

      axiosInstance
        .get(`/v1/customers/${appConfig.userId}/statistics`, {
          headers: { Authorization: `Bearer ${tokenCookie}` },
        })
        .then(({ data: response }) => {
          setUserStats(response.data); // Set the statistics data
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchStatistics();

    // Revalidate (refresh) data every 5 Min
    const intervalId = setInterval(fetchStatistics, 5 * 60 * 1000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [tokenCookie]);

  useEffect(() => {
    if (pointsToRedeem && pointsToRedeem > 0) {
      setErrors({
        ...errors,
        pointsToRedeem: "",
      });
    }

    if (amount && amount > 0) {
      setErrors({
        ...errors,
        amount: "",
      });
    }
  }, [amount, pointsToRedeem]);

  useEffect(() => {
    if (isSuccess) {
      const timeout = setTimeout(() => {
        setIsSuccess(false);
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [isSuccess]);

  const columns: ColumnDef<LoyaltyPoints>[] = [
    {
      accessorKey: "id",
      header: () => <HeaderCell heading="Sr. No." />,
      cell: ({ row }) => <span>{String(row.index + 1).padStart(2, "0")}</span>,
    },
    {
      accessorKey: "points",
      header: () => <HeaderCell heading="Points" />,
      cell: ({ row }) => <span className="text-xs">{row.original.points}</span>,
    },
    {
      accessorKey: "type",
      header: () => <HeaderCell heading="Type" />,
      cell: ({ row }) => {
        const { type } = row.original;
        const className =
          type === LoyaltyPointType.Earned ? "text-green-500" : "text-red-500";
        return (
          <span className={`text-xs capitalize ${className}`}>{type}</span>
        );
      },
    },
    {
      accessorKey: "amount",
      header: () => <HeaderCell heading="Amount" />,
      cell: ({ row }) => {
        const { currency, amount } = row.original;
        return (
          <span className="text-xs">
            {amount && currency
              ? getFormattedAmount({ amount, currency })
              : "-"}
          </span>
        );
      },
    },
    {
      accessorKey: "voucherCode",
      header: () => <HeaderCell heading="Voucher Code" />,
      cell: ({ row }) => {
        const { voucherCode } = row.original;
        return voucherCode ? (
          <div className="flex flex-row gap-2">
            <span className="text-xs">{voucherCode ? voucherCode : "-"}</span>
            <CopyIcon
              copyText={voucherCode}
              successMessage="Copied Successfully"
            />
          </div>
        ) : (
          "-"
        );
      },
    },
    {
      accessorKey: "additionalInfo",
      header: () => <HeaderCell heading="Additional Info" />,
      cell: ({ row }) => (
        <span className="text-xs">{row.original.additionalInfo ?? "-"}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => <HeaderCell heading="Created At" />,
      cell: ({ row }) => (
        <span className="text-xs">
          {row.original.createdAt
            ? dayMonthYearFormatter(row.original.createdAt)
            : "-"}
        </span>
      ),
    },
  ];

  const onPaginationChange = (pagination: PaginationState) => {
    setPage(pagination);
  };

  const table = useReactTable({
    columns,
    data: pointsData,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onPaginationChange: onPaginationChange as OnChangeFn<PaginationState>,
    state: {
      rowSelection: undefined,
      pagination: page,
    },
  });

  const handleRedeem = () => {
    if (!pointsToRedeem || pointsToRedeem <= 0) {
      setErrors({
        ...errors,
        pointsToRedeem: "Points to redeem must be greater than 0.",
      });
      return;
    }

    if (!amount || amount <= 0) {
      setErrors({
        ...errors,
        amount: "Amount must be greater than 0.",
      });
      return;
    }

    setShowConfirmation(true);
  };

  const handleRedeemConfirmation = () => {
    const token = getTokenCookie();
    setShowConfirmation(false);

    setIsLoading(true);

    axiosInstance
      .post(
        "/v1/customers/redeem-points",
        {
          userExternalId: appConfig.userId,
          loyaltyProgramId: appConfig.loyaltyProgramId,
          pointsToRedeem: pointsToRedeem,
          additionalInfo: additionalInfo,
          amount,
          earningType: EarningRuleType.Redemption,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(({ data: response }) => {
        successToast(
          response?.data?.message ?? "Points redeemed successfully."
        );
        setRedeemPointsRes(response?.data);
        fetchPointsHistory();
        fetchStatistics();
        setIsLoading(false);
      })
      .catch((error) => {
        errorToast(
          error?.response?.data?.message ??
            "Unexpected error while redeeming points."
        );
      })
      .finally(() => {
        setIsLoading(false);
        setOpenModal(false);
        setPointsToRedeem(undefined);
        setAmount(undefined);
        setAdditionalInfo("");
      });
  };

  return (
    <>
      {isLoading ? <Loader /> : null}
      <div className="p-6">
        {/* Statistics Cards */}
        <h1 className="text-2xl font-bold mb-4">Loyalty Points</h1>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-600 p-6 rounded-xl shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
            <h3 className="text-white text-sm font-semibold">
              Current Available Points
            </h3>
            <p className="text-2xl font-bold text-white">
              <CountUp targetNumber={userStats.currentAvailablePoints} />
            </p>
          </div>
          <div className="bg-gray-700 p-6 rounded-xl shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
            <h3 className="text-white text-sm font-semibold">
              Redeemed Points
            </h3>
            <p className="text-2xl font-bold text-white">
              <CountUp targetNumber={userStats.redeemedPoints} />
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
            <h3 className="text-white text-sm font-semibold">
              Lifetime Collected Points
            </h3>
            <p className="text-2xl font-bold text-white">
              <CountUp targetNumber={userStats.lifeTimeCollectedPoints} />
            </p>
          </div>
        </div>
        <div className="flex justify-between mb-2">
          <h1 className="text-2xl font-bold mb-4">Loyalty Points History</h1>
          <button
            onClick={() => setOpenModal(true)}
            className="px-4 py-[6px] bg-blue-500 text-white rounded-md hover:cursor-pointer"
          >
            Redeem Points
          </button>
        </div>
        {/* Show loading state while data is being fetched */}
        {isPointsLoading ? (
          !isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-solid rounded-full border-t-transparent border-primary"></div>
            </div>
          ) : null
        ) : (
          <table className="table-auto w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="h-16">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-sm font-bold pl-6 rtl:pr-6 rtl:pl-0 py-6 whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  className={index % 2 ? "h-14" : "h-14 bg-alternator"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="pl-6 rtl:pr-6 rtl:pl-0 py-2 text-sm whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {table.getState().pagination && pointsData?.length ? (
          <div className="sticky flex items-center justify-between gap-2 flex-wrap p-6">
            <div className="flex items-center justify-start gap-4 rtl:flex-row-reverse">
              <button
                className="p-2 border border-input rounded cursor-pointer hover:bg-input active:bg-input"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <FaChevronLeft className="text-sm" />
              </button>
              <button
                className="p-2 border border-input rounded cursor-pointer hover:bg-input active:bg-input"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          </div>
        ) : null}

        {/* Modal */}
        {openModal && (
          <Modal onClose={() => setOpenModal(false)} className="p-6">
            <h2 className="text-xl font-semibold mb-4">Redeem Points</h2>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                placeholder="0"
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-md"
                required
              />
              {errors?.amount ? (
                <p className="text-red-500">{errors.amount}</p>
              ) : null}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Points to Redeem
              </label>
              <input
                type="number"
                value={pointsToRedeem}
                placeholder="0"
                onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-md"
                required
              />
              {errors?.pointsToRedeem ? (
                <p className="text-red-500">{errors.pointsToRedeem}</p>
              ) : null}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Additional Info (Optional)
              </label>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={handleRedeem}
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:cursor-pointer"
            >
              Redeem
            </button>
          </Modal>
        )}

        {isSuccess && (
          <Modal onClose={() => setIsSuccess(false)} className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Redemption Successful!
            </h2>
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">Success 🎉</p>
              <p className="mb-1">You’ve successfully redeemed your points.</p>
              {redeemPointsRes?.discountedAmount !== undefined &&
              !isNaN(redeemPointsRes?.discountedAmount) &&
              redeemPointsRes?.currency ? (
                <p>
                  After redeeming your points, your payable amount is&nbsp;
                  <span className="font-bold">
                    {getFormattedAmount({
                      amount: String(redeemPointsRes.discountedAmount),
                      currency: redeemPointsRes.currency,
                    })}
                  </span>
                  .
                </p>
              ) : null}
              <button
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => setIsSuccess(false)}
              >
                Close
              </button>
            </div>
          </Modal>
        )}

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <ConfirmationDialog
            message="Are you sure you want to redeem these points?"
            onConfirm={handleRedeemConfirmation}
            onCancel={() => setShowConfirmation(false)}
          />
        )}
      </div>
    </>
  );
};

export default LoyaltyPointsHistory;
