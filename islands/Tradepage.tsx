import { useEffect, useState } from "preact/hooks";
import { useGraphQLQuery } from "../hooks/useGraphQLQuery.ts";
import { Company } from "../routes/models/company.ts";
import InvestmentsPanel from "../components/InvestmentsPanel.tsx";
import Graph from "./Graph.tsx";
import TimeButton from "../components/TimeButton.tsx";
import { TimeType } from "../components/types/types.tsx";
import Footer from "../components/Footer.tsx";

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
    }`,
  );

  const [type, setType] = useState<TimeType>(TimeType.TEN_MINUTES);
  const [consoleText, setConsoleText] = useState(defaultConsoleText);
  const percentageChange = "5.6";

  const processData = (
    priceHistory: number[] | undefined,
    numOfDataPoints: number,
    stride: number,
  ) => {
    if (!priceHistory) return [];
    const slicedData = priceHistory.slice(
      priceHistory.length - numOfDataPoints,
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

  return (
    <div className="grid grid-cols-6 bg-custom-dark-brown min-h-screen overflow-hidden">
      <style>{style}</style>
      <div className="col-span-1">

      </div>
      <div className="col-span-4 pt-20 h-full transform bg-custom-dark-brown flex">
        <div className="w-4/6 bg-custom-light-brown relative rounded-l">
          <div className="w-5/6 mx-auto bg-white rounded-md mt-6 text-lg">
            <div
              className="relative"
              style={{
                position: "relative",
                overflow: "hidden",
              }}
            >
              <p
                className="text-custom-dark-green font-inter font-bold text-20px leading-normal tracking-tighter rotating-text"
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

          <div className="w-5/6 h-2/7 mx-auto bg-custom-light-brown rounded-t-md rounded-b-md mt-6 text-lg flex flex-col items-start justify-between">
            <div>
              <div className="flex justify-between">
                <div className="text-white font-inter text-3xl font-bold">
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
              <div className="text-white font-inter text-xs">
                {data?.company.name}
              </div>
            </div>

            <div className="relative w-full h-100 bg-gray-700 mt-3 rounded-b-md rounded-t-md flex flex-row items-center justify-center">
              <div className="absolute top-4 flex flex-row gap-2 ">
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
              <Graph data={getData(type)} type={type} />
            </div>
          </div>
        </div>
        {/* Stock graph div */}

        <div className="w-1/3 bg-custom-light-brown rounded-r pl-10">
          <InvestmentsPanel info={TOTALWATCHLISTINFO} />
        </div>
        {/* Investment div */}
      </div>
    </div>
  );
}
