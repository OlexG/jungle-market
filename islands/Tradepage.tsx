import { useEffect, useState } from "preact/hooks";
import { useGraphQLQuery } from "../hooks/useGraphQLQuery.ts";
import { Company } from "../routes/models/company.ts";
import InvestmentsPanel from "../components/InvestmentsPanel.tsx";
import Graph from "./Graph.tsx";
import TimeButton from "../components/TimeButton.tsx";
import { TimeType } from "../components/types/types.tsx";
import { useGraphQLMutation } from "../hooks/useGraphQLMutation.ts";
import ErrorAlert from "../components/Error.tsx";
import SuccessAlert from "../components/Success.tsx";
import { User } from "../routes/models/user.ts";
import { makeCent } from "../generation/priceGeneration.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";


const defaultConsoleText = " -- PTRE 12.1% -- BNNNS 11.5% -- PTRR 1.3%";

const style = `
    @keyframes rotate {
      0% {
        transform: translateX(100%);
      }
      100% {
        transform: translateX(-100%);
      }
    }
  `;

interface ModalProps {
  type: string;
  amount: number;
  closeModal: () => void;
  executeOrder: Function;
  companyID: string;
}

function Modal({
  type,
  amount,
  closeModal,
  executeOrder,
  companyID,
}: ModalProps) {
  const [userID, setUserID] = useState<string>(""); // TODO: fix ID and Id
  useEffect(() => {
    if (localStorage.getItem("userData")) {
      const object = JSON.parse(localStorage.getItem("userData") as any);
      setUserID(object.id);
    }
  }, []);

  return (
    <div className="text-white fixed z-50 inset-0 bg-custom-light-main bg-opacity-90 flex items-center justify-center">
      <div className="shadow bg-custom-dark-main rounded px-10 py-5 w-96 w-full text-center">
        <h2 className="text-2xl font-bold mb-2">
          {type === "buy" ? "Confirm Purchase" : "Confirm Sale"}
        </h2>
        <p className="mb-4">
          {`Are you sure you want to ${type} ${amount} shares?`}
        </p>
        <div className="w-full flex flex-row items-center justify-center">
          <button
            className="px-3 py-2 bg-red-600 text-white rounded mr-2 font-bold hover:bg-red-700"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className={`${
              amount === 0 ? "opacity-50" : ""
            } px-3 py-2 bg-green-600 text-white rounded font-bold ${
              amount === 0 ? "cursor-not-allowed" : "hover:bg-green-700"
            }`}
            onClick={() => {
              executeOrder(
                userID,
                companyID,
                amount,
                type === "buy" ? "buy" : "sell"
              );
              closeModal();
            }}
            disabled={amount === 0}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Tradepage({ id }: { id: string }) {
  let { data, error, loading } = useGraphQLQuery<{ company: Company } | null>(
    `{
      company(id: "${id}") {
        name
        id
        ticker
        sector
        currentPrice
        dailyPriceHistory
        thirtyDaysPriceHistory
      } 
    }`
  );

  let {
    data: priceData,
    error: priceError,
    loading: priceLoading,
    refetch,
  } = useGraphQLQuery<{ company: Company } | null>(
    `{
      company(id: "${id}") {
        currentPrice
        dailyPriceHistory
        thirtyDaysPriceHistory
      }
    }`,
    true
  );

  const [userID, setUserID] = useState<string | null>(null);
  useEffect(() => {
    if (IS_BROWSER && localStorage.getItem("userData")) {
      const object = JSON.parse(localStorage.getItem("userData") as any);
      setUserID(object.id);
    }
  }, [IS_BROWSER]); // TODO: make this a custom hook and replace in other places

  const {
    data: portfolioData,
    error: portfolioError,
    loading: portfolioLoading,
    refetch: portfolioRefetch,
  } = useGraphQLQuery<{ user: User } | null>(
    `{
        user(id: "${userID}") {
          portfolio {
            numberOfShares
            totalSpent
            company {
              ticker
              currentPrice
            }
          }
        } 
      }`
  );

  useEffect(() => {
    // get the company every minute
    const interval = setInterval(() => {
      refetch();
      portfolioRefetch();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const {
    data: orderData,
    error: orderError,
    loading: orderLoading,
    mutate: executeOrderMutation,
  } = useGraphQLMutation(); // TODO: make this easier to use

  const executeOrder = (
    userID: string,
    companyID: string,
    numberOfShares: number,
    type: string
  ) =>
    executeOrderMutation(
      `
      mutation {
        createOrder(
          userID: "${userID}"
          companyID: "${companyID}"
          numberOfShares: ${numberOfShares}
          type: ${type}
        ) {
          id
          user {
            id
          }
          company {
            ticker
          }
          numberOfShares
          type
        }
      }
    `
    );

  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  useEffect(() => {
    if (orderError) {
      setIsError(true);
    }
    if (orderData && !orderError) {
      portfolioRefetch();
      setIsSuccess(true);
    }
  }, [orderError, orderData]);

  const [type, setType] = useState<TimeType>(TimeType.TEN_MINUTES);
  const [consoleText, setConsoleText] = useState(defaultConsoleText);
  const [amount, setAmount] = useState(1);
  const [currentOrderType, setCurrentOrderType] = useState("buy");
  const [confirmBuyModalOpen, setConfirmBuyModalOpen] = useState(false);

  const percentageChange = "5.6";

  const handleInputNumberChange = (e: any) => {
    setAmount(e.target.value);
  };

  const handleBuyClick = () => {
    setCurrentOrderType("buy");
    setConfirmBuyModalOpen(true);
  };

  const handleSellClick = () => {
    setCurrentOrderType("sell");
    setConfirmBuyModalOpen(true);
  };

  const processData = (
    priceHistory: number[] | undefined,
    numOfDataPoints: number,
    stride: number
  ) => {
    if (!priceHistory) return [];
    const slicedData = priceHistory.slice(
      priceHistory.length - numOfDataPoints
    );
    if (!slicedData) return [];
    const reducedData = [];
    for (let i = slicedData.length - 1; i >= 0; i -= stride) {
      reducedData.push(slicedData[i]);
    }
    reducedData.reverse();
    return reducedData;
  };

  const getData = (type: TimeType) => {
    const dataToProcess = priceData ? priceData : data; // Price data is undefined at first
    switch (type) {
      case TimeType.TEN_MINUTES:
        return processData(dataToProcess?.company.dailyPriceHistory, 10, 1);
      case TimeType.HOURLY:
        return processData(dataToProcess?.company.dailyPriceHistory, 60, 5);
      case TimeType.DAILY:
        return processData(
          dataToProcess?.company.dailyPriceHistory,
          24 * 60,
          60
        );
      case TimeType.THIRTY_DAYS:
        return processData(
          dataToProcess?.company.thirtyDaysPriceHistory,
          30 * 24,
          24
        );
      default:
        return [];
    }
  };

  if (loading || !data?.company) {
    return <div>Loading...</div>;
  }
  // TODO: split these into components
  return (
    <div className="grid grid-cols-6 bg-custom-dark-main min-h-screen overflow-hidden">
      {orderError && (
        <ErrorAlert
          message={(orderError as Error).message}
          setIsOpen={setIsError}
          isOpen={isError}
        />
      )}
      {orderData && (
        <SuccessAlert
          message={"Order successfully executed!"}
          setIsOpen={setIsSuccess}
          isOpen={isSuccess}
        />
      )}
      {confirmBuyModalOpen && (
        <Modal
          type={currentOrderType}
          amount={amount}
          closeModal={() => setConfirmBuyModalOpen(false)}
          executeOrder={executeOrder}
          companyID={data?.company.id}
        />
      )}
      <style>{style}</style>
      <div className="col-span-1 pt-20 h-full"></div>
      <div className="col-span-4 pt-20 h-full transform bg-custom-dark-main">
        <div className="w-full flex flex-row">
          <div className="h-120 w-4/6 bg-custom-light-main relative rounded mr-4 shadow-lg shadow-gray-200">
            <div className="w-5/6 mx-auto bg-custom-off-white rounded mt-6 text-lg">
              <div
                className="relative bg-custom-dark-main rounded"
                style={{
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <p
                  className="bg-custom-dark-main text-custom-off-white font-inter font-bold text-20px leading-normal tracking-tighter rotating-text"
                  style={{
                    animationName: "rotate",
                    animationDuration: "10s",
                    animationTimingFunction: "linear",
                    animationIterationCount: "infinite",
                  }}
                >
                  {consoleText}
                </p>
              </div>
            </div>

            <div className="w-5/6 mx-auto bg-custom-light-main rounded-t rounded-b mt-6 text-lg flex flex-col items-start justify-between">
              <div>
                <div className="flex justify-between">
                  <div className="text-custom-off-white font-inter text-3xl font-bold">
                    {data?.company.ticker +
                      " $" +
                      (priceData?.company.currentPrice
                        ? priceData?.company.currentPrice
                        : data?.company.currentPrice)}
                  </div>
                  <div
                    className={`mt-2 ml-2 font-bold text-xl ${
                      parseFloat(percentageChange) > 0
                        ? "text-custom-dark-green"
                        : parseFloat(percentageChange) < 0
                        ? "text-custom-red"
                        : "text-gray-500"
                    }`}
                  >
                    {percentageChange + "%"}
                  </div>
                </div>
                <div className="text-custom-off-white font-inter text-xs">
                  {data?.company.name}
                </div>
              </div>

              <div className="relative w-full h-100 bg-gray-700 mt-3 rounded-b rounded-t flex flex-row items-center justify-center">
                <div className="absolute top-0">
                  <Graph data={getData(type)} type={type} />
                </div>
                <div className="absolute bottom-4 flex flex-row gap-2">
                  <TimeButton
                    currentType={type}
                    thisType={TimeType.THIRTY_DAYS}
                    thisText={"30 Days"}
                    setCurrentType={setType}
                  />
                  <TimeButton
                    currentType={type}
                    thisType={TimeType.DAILY}
                    thisText={"1 Day"}
                    setCurrentType={setType}
                  />
                  <TimeButton
                    currentType={type}
                    thisType={TimeType.HOURLY}
                    thisText={"1 Hour"}
                    setCurrentType={setType}
                  />
                  <TimeButton
                    currentType={type}
                    thisType={TimeType.TEN_MINUTES}
                    thisText={"10 Min"}
                    setCurrentType={setType}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Stock graph div */}

          <div className="w-1/3 shadow-lg shadow-gray-200 flex flex-col gap-4">
            <div className="h-100 rounded bg-custom-light-main">
              <InvestmentsPanel
                info={
                  userID
                    ? portfolioData?.user.portfolio.map((e) => {
                        const totalSpent = e.totalSpent;
                        const currentValue =
                          e.company.currentPrice * e.numberOfShares;
                        const percentageChange =
                          ((currentValue - totalSpent) / totalSpent) * 100;
                        console.log(e);
                        return {
                          ticker: "$" + e.company.ticker,
                          percentageChange: makeCent(percentageChange),
                        };
                      })
                    : undefined
                }
              />
            </div>
            <div className="rounded bg-custom-light-main flex flex-col items-center pb-4">
              <div className="flex flex-row h-10 gap-3 mt-5">
                <button
                  className="bg-custom-dark-green hover:bg-green-700 px-8 py-2 text-white rounded font-bold"
                  onClick={handleBuyClick}
                >
                  Buy
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 px-8 py-2 text-white rounded font-bold"
                  onClick={handleSellClick}
                >
                  Sell
                </button>
              </div>
              <h1 className="text-white font-bold text-lg mt-5">Amount</h1>
              <input
                className="w-20 p-2 rounded-md shadow bg-white hover:scale-105 flex flex-row items-center justify-center "
                type="number"
                step="1"
                onChange={(e) => handleInputNumberChange(e)}
                value={amount}
              />
            </div>
          </div>
        </div>
        <div className="bg-custom-light-main rounded mt-4 p-10">
          <h1 className="text-white font-bold">News</h1>
        </div>
      </div>
    </div>
  );
}
