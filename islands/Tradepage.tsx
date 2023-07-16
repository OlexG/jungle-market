import { useEffect, useState } from "preact/hooks";
import { useGraphQLQuery } from "../hooks/useGraphQLQuery.ts";
import { Company } from "../routes/models/company.ts";
import InvestmentsPanel from "../components/InvestmentsPanel.tsx";
import Graph from "./Graph.tsx";

interface IProps {
  id: string;
}

export default function Tradepage(props: IProps) {
  console.log(props.id)
  const { data, error, loading } = useGraphQLQuery<
    {
      company: Company;
    } | null
  >(`
    {
      company(id: "${props.id}") {
        name
        id
        ticker
        sector
        currentPrice
        dailyPriceHistory
        weeklyPriceHistory
      } 
    }`);
  
  console.log(data, error, loading);


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
              <div className="text-white font-inter text-xs">{data?.company.name}</div>
            </div>

            <div className="w-full h-100 bg-white mt-3 rounded-xl flex flex-row items-center justify-center">
              <Graph 
                data={// get the latest 60 data points from the company
                  data?.company.dailyPriceHistory.slice(
                    data?.company.dailyPriceHistory.length - 10,
                    data?.company.dailyPriceHistory.length
                  )
                }
              />
            </div>
          </div>
        </div>
        {/* Stock graph div */}

        <div className="w-2/6 bg-custom-tan">
          <InvestmentsPanel
            info={TOTALWATCHLISTINFO}
          />
        </div>
        {/* Investment div */}
      </div>
    </div>
  );
}
