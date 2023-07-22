import { useEffect, useState } from "preact/hooks";
import { useGraphQLQuery } from "../hooks/useGraphQLQuery.ts";
import { Company } from "../routes/models/company.ts";
import InvestmentsPanel from "../components/InvestmentsPanel.tsx";
import Graph from "./Graph.tsx";
import TimeButton from "../components/TimeButton.tsx";
import { TimeType } from "../components/types/types.tsx";
import Footer from "../components/Footer.tsx";
import { useGraphQLMutation } from "../hooks/useGraphQLMutation.ts";

const TOTALWATCHLISTINFO = [
  { ticker: "PLMP", percentageChange: 5.6 },
  { ticker: "AAPL", percentageChange: -1.2 },
  { ticker: "GOOGL", percentageChange: 3.8 },
  { ticker: "AMZN", percentageChange: 2.1 },
  { ticker: "TSLA", percentageChange: 1.2 },
  { ticker: "MSFT", percentageChange: 0.5 },
  { ticker: "FB", percentageChange: 0.2 },
  { ticker: "NVDA", percentageChange: 0.1 },
  { ticker: "PYPL", percentageChange: 0.0 },
  { ticker: "ADBE", percentageChange: -0.1 },
  { ticker: "NFLX", percentageChange: -0.2 },
  { ticker: "INTC", percentageChange: -0.3 },
  { ticker: "CMCSA", percentageChange: -0.4 },
  { ticker: "PEP", percentageChange: -0.5 },
  { ticker: "CSCO", percentageChange: -0.6 },
  { ticker: "AVGO", percentageChange: -0.7 },
  { ticker: "TMUS", percentageChange: -0.8 },
];

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
      <div className="shadow bg-custom-dark-main rounded-lg px-10 py-5 w-96 w-full text-center">
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
  const { data, error, loading } = useGraphQLQuery<{ company: Company } | null>(
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
    switch (type) {
      case TimeType.TEN_MINUTES:
        return processData(data?.company.dailyPriceHistory, 10, 1);
      case TimeType.HOURLY:
        return processData(data?.company.dailyPriceHistory, 60, 5);
      case TimeType.DAILY:
        return processData(data?.company.dailyPriceHistory, 24 * 60, 60);
      case TimeType.THIRTY_DAYS:
        return processData(data?.company.thirtyDaysPriceHistory, 30 * 24, 24);
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
                className="relative bg-custom-dark-main"
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
                    {data?.company.ticker + " $" + data?.company.currentPrice}
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
              <InvestmentsPanel info={TOTALWATCHLISTINFO} />
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
          <h1 className="text-white font-bold">
            News
          </h1>
        </div>
      </div>
    </div>
  );
}
