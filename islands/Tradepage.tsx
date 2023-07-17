import { useEffect, useState } from "preact/hooks";
import { useGraphQLQuery } from "../hooks/useGraphQLQuery.ts";
import { Company } from "../routes/models/company.ts";
import InvestmentsPanel from "../components/InvestmentsPanel.tsx";
import Graph from "./Graph.tsx";
import TimeButton from "../components/TimeButton.tsx";

interface IProps {
  id: string;
}

export default function Tradepage(props: IProps) {
  const { data, error, loading } = useGraphQLQuery<{
    company: Company;
  } | null>(`
    {
      company(id: "${props.id}") {
        name
        id
        ticker
        sector
        currentPrice
        dailyPriceHistory
        thirtyDaysPriceHistory
      } 
    }`);

  const [type, setType] = useState("10 minutes");

  const [consoleText, setConsoleText] = useState(
    " -- PTRE 12.1% -- BNNNS 11.5% -- PTRR 1.3%"
  );

  const percentageChange = "5.6";
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

  const TOTALWATCHLISTINFO: { ticker: string; percentageChange: number }[] = [
    { ticker: "PLMP", percentageChange: 5.6 },
    { ticker: "AAPL", percentageChange: -1.2 },
    { ticker: "GOOGL", percentageChange: 3.8 },
    { ticker: "GOOGL", percentageChange: 3.8 },
    { ticker: "GOOGL", percentageChange: 3.8 },
    { ticker: "GOOGL", percentageChange: 3.8 },
    { ticker: "GOOGL", percentageChange: 3.8 },
    { ticker: "GOOGL", percentageChange: 3.8 },
    { ticker: "GOOGL", percentageChange: 3.8 },
    { ticker: "GOOGL", percentageChange: 3.8 },
    { ticker: "GOOGL", percentageChange: 3.8 },
  ];

  function getData(type: string) {
    if (type === "10 minutes") {
      // return the last 10 data points
      const dailyData = data?.company.dailyPriceHistory.slice(
        data?.company.dailyPriceHistory.length - 10
      );
      if (!dailyData) return [];
      return dailyData;
    } 
    else if (type === "hourly") {
      // get the last 60 data points, counting by 5
      const dailyData = data?.company.dailyPriceHistory.slice(
        data?.company.dailyPriceHistory.length - 60
      );
      if (!dailyData) return [];
      const dailyDataReduced = [];
      for (let i = dailyData.length - 1; i >= 0; i -= 5) {
        dailyDataReduced.push(dailyData[i]);
      }
      dailyDataReduced.reverse();
      return dailyDataReduced;
    }
    else if (type === "daily") {
      // get the last 24 data points, counting by 60
      const dailyData = data?.company.dailyPriceHistory.slice(
        data?.company.dailyPriceHistory.length - 24 * 60
      );
      if (!dailyData) return [];
      const dailyDataReduced = [];
      for (let i = dailyData.length - 1; i >= 0; i -= 60) {
        dailyDataReduced.push(dailyData[i]);
      }
      dailyDataReduced.reverse();
      return dailyDataReduced;
    } else if (type === "30 days") {
      // get the last 30 data points, counting by 24
      const weeklyData = data?.company.thirtyDaysPriceHistory.slice(
        data?.company.thirtyDaysPriceHistory.length - 30 * 24
      );
      if (!weeklyData) return [];
      const weeklyDataReduced = [];
      for (let i = weeklyData.length - 1; i >= 0; i -= 24) {
        weeklyDataReduced.push(weeklyData[i]);
      }
      weeklyDataReduced.reverse();
      return weeklyDataReduced;
    }
    return []
  }


  if (loading || !data?.company) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-custom-light-tan min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="pt-20 w-3/5 h-full transform center bg-custom-tan absolute flex">
        <style>{style}</style>
        <div className="w-4/6 bg-custom-tan relative">
          <div className="w-5/6 mx-auto bg-white rounded-l mt-6 text-lg">
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

          <div className="w-5/6 h-2/7 mx-auto bg-custom-tan rounded-l mt-6 text-lg flex flex-col items-start justify-between">
            <div>
              <div className="flex justify-between">
                <div className="text-white font-inter text-3xl font-bold">
                  {data?.company.ticker + " $" + data?.company.currentPrice}
                </div>
                <div
                  className={`mt-2 ml-2 font-inter text-xl ${
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

            <div className="relative w-full h-100 bg-white mt-3 rounded-xl flex flex-row items-center justify-center">
              <div className="absolute top-4 flex flex-row gap-2">
                <TimeButton
                  currentType={type} // @TODO: make type a typescript type
                  thisType={"30 days"}
                  thisText={"30 Days"}
                  setCurrentType={setType}
                />
                <TimeButton
                  currentType={type}
                  thisType={"daily"}
                  thisText={"Day"}
                  setCurrentType={setType}
                />
                <TimeButton
                  currentType={type}
                  thisType={"hourly"}
                  thisText={"Hour"}
                  setCurrentType={setType}
                />
                <TimeButton
                  currentType={type}
                  thisType={"10 minutes"}
                  thisText={"10 min"}
                  setCurrentType={setType}
                />
              </div>
              <Graph
                data={
                  getData(type)
                }
                type={type}
              />
            </div>
          </div>
        </div>
        {/* Stock graph div */}

        <div className="w-2/6 bg-custom-tan">
          <InvestmentsPanel info={TOTALWATCHLISTINFO} />
        </div>
        {/* Investment div */}
      </div>
    </div>
  );
}
