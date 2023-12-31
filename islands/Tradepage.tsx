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
import BuyPanel from "../components/BuyPanel.tsx";
import useuserId from "../hooks/useUserID.ts";
import Modal from "../components/TradePageModal.tsx";
import TradepageNewsComponent from "../components/TradepageNewsComponent.tsx";
import FlashingPrice from "../components/FlashingPrice.tsx";
import Information from "../components/Information.tsx";
import Loading from "../components/Loading.tsx";
import TutorialWrapper from "../components/TutorialWrapper.tsx";
import TutorialMonkey from "../components/TutorialMonkey.tsx";

const defaultConsoleText = " -- PTRE 12.1% -- BNNNS 11.5% -- PTRR 1.3%";
const tutorialTexts = [
  "Welcome to the trade page! Here you can buy and sell stocks. This is the graph of the stock price over time. You can change the time period by clicking on the buttons below. Try it out!",
  "This is your portfolio. You can see how many shares you own and how much you have spent on each company. You can click on the company name to go to the company trade page.",
  "This is the buy and sell menu. Here you can put in how many shares you want to buy or sell and then do so. Try it out!",
  "This is the information panel. Here you can see general information about the company and it's fundamentals. TODO explain these",
  "This is the news panel. Here you can see the latest news about the company. You can click on the news to read more about it. Remember that news can affect the stock price!",
];

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

const formatPercentage = (percent: number) => {
  return percent.toFixed(2) + "%";
};

export default function Tradepage({ id }: { id: string }) {
  const [currentTutorialPanel, setCurrentTutorialPanel] = useState(0);

  const { data, loading } = useGraphQLQuery<{ company: Company } | null>(
    `{
      company(id: "${id}") {
        name
        id
        ticker
        sector
        currentPrice
        dailyPriceHistory
        thirtyDaysPriceHistory
        roe
        peRatio
        deRatio
        grossMargin
        netIncome
        ceo
        description
        rating
        newsStories {
          title
          description
          id
          createdAt
        }
      } 
    }`
  );
  const { data: priceData, refetch } = useGraphQLQuery<{
    company: Company;
  } | null>(
    `{
      company(id: "${id}") {
        currentPrice
        dailyPriceHistory
        thirtyDaysPriceHistory
      }
    }`,
    true
  );

  const userId = useuserId();

  const { data: portfolioData, refetch: portfolioRefetch } = useGraphQLQuery<{
    user: User;
  } | null>(
    `{
        user(userId: "${userId}") {
          portfolio {
            numberOfShares
            totalSpent
            company {
              ticker
              currentPrice
              id
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
    userId: string,
    companyId: string,
    numberOfShares: number,
    type: string
  ) =>
    executeOrderMutation(
      `
      mutation {
        createOrder(
          userId: "${userId}"
          companyId: "${companyId}"
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

  const stockData = getData(type);

  let percentageChange =
    stockData.length > 0
      ? ((stockData[stockData.length - 1] - stockData[0]) / stockData[0]) * 100
      : 0;

  if (loading || !data?.company) {
    return <Loading />;
  }
  // TODO: split these into components
  return (
    <div className="grid grid-cols-6 min-h-screen overflow-hidden bg-gray-100">
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
          companyId={data?.company.id}
          userId={userId}
        />
      )}
      <style>{style}</style>
      <div className="col-span-1 pt-20 h-full"></div>
      <div className="col-span-4 pt-20 h-full transform">
        <div className="w-full flex flex-row">
          <TutorialWrapper
            currentPanel={currentTutorialPanel}
            showPanel={0}
            maxPanel={5}
          >
            <div className="h-120 w-4/6 border border-blue-500 relative rounded mr-4 shadow-lg shadow-lg bg-white">
              <div className="w-5/6 mx-auto rounded mt-6 text-lg">
                <div
                  className="relative border bg-blue-500 shadow-sm rounded"
                  style={{
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <p
                    className="bg-blue-500 text-white font-inter text-20px leading-normal tracking-tighter rotating-text"
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

              <div className="w-5/6 mx-auto rounded-t rounded-b mt-6 text-lg flex flex-col items-start justify-between">
                <div>
                  <div className="flex justify-between">
                    <div className="text-custom-light-main font-inter text-3xl">
                      {data?.company.ticker} {/* @ts-ignore */}
                      <FlashingPrice
                        price={
                          priceData?.company.currentPrice
                            ? priceData?.company.currentPrice
                            : data?.company.currentPrice
                        }
                      />
                    </div>
                    <div
                      className={`mt-2 ml-2 font-bold text-xl ${
                        percentageChange > 0
                          ? "text-custom-dark-green"
                          : percentageChange < 0
                          ? "text-custom-red"
                          : "text-gray-500"
                      }`}
                    >
                      {formatPercentage(percentageChange)}
                    </div>
                  </div>
                  <div className="text-custom-gray font-inter text-xs">
                    {data?.company.name}
                  </div>
                </div>

                <div className="relative w-full h-100 mt-3 rounded-b rounded-t flex flex-row items-center justify-center">
                  <div className="absolute top-0">
                    <Graph data={stockData} type={type} />
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
          </TutorialWrapper>
          {/* Stock graph div */}

          <div className="w-1/3 flex flex-col gap-4">
            <TutorialWrapper
              currentPanel={currentTutorialPanel}
              showPanel={1}
              maxPanel={5}
            >
              <div className="h-100 rounded border border-custom-light-green shadow-lg bg-white">
                <InvestmentsPanel
                  info={
                    userId
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
                            id: e.company.id,
                          };
                        })
                      : undefined
                  }
                />
              </div>
            </TutorialWrapper>
            <TutorialWrapper
              currentPanel={currentTutorialPanel}
              showPanel={2}
              maxPanel={5}
            >
              <div>
                <BuyPanel
                  handleBuyClick={handleBuyClick}
                  handleSellClick={handleSellClick}
                  handleInputNumberChange={handleInputNumberChange}
                  amount={amount}
                />
              </div>
            </TutorialWrapper>
          </div>
        </div>
        <TutorialWrapper
          currentPanel={currentTutorialPanel}
          showPanel={3}
          maxPanel={5}
        >
          <div>
            <Information company={data?.company} />
          </div>
        </TutorialWrapper>
        <TutorialWrapper
          currentPanel={currentTutorialPanel}
          showPanel={4}
          maxPanel={5}
        >
          <div className="border border-yellow-500 bg-white rounded shadow-lg mt-4 p-10 mb-4">
            <h1 className="text-yellow-500 font-semibold text-lg">News</h1>
            <div className="flex flex-col gap-4 mt-4">
              {data?.company.newsStories.map((story) => (
                <TradepageNewsComponent
                  title={story.title}
                  id={story.id}
                  date={story.createdAt}
                />
              ))}
            </div>
          </div>
        </TutorialWrapper>
      </div>
      <TutorialMonkey
        texts={tutorialTexts}
        name="Tradepage"
        setNextPanel={() => setCurrentTutorialPanel(currentTutorialPanel + 1)}
        setPreviousPanel={() => setCurrentTutorialPanel(currentTutorialPanel - 1)}
        setPanelNumber={setCurrentTutorialPanel}
      />
    </div>
  );
}
