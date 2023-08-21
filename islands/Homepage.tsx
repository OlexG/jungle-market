import { useState } from "preact/hooks";

import { useGraphQLQuery } from "../hooks/useGraphQLQuery.ts";
import { Company } from "../routes/models/company.ts";
import { sectorNames } from "../generation/nameGeneration.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import Loading from "../components/Loading.tsx";
import TutorialWrapper from "../components/TutorialWrapper.tsx";
import TutorialMonkey from "../components/TutorialMonkey.tsx";

const sectorsToColorMap = {
  "Technology Sector": "blue",
  "Production Sector": "yellow",
  "Healthcare Sector": "pink",
  "Financial Sector": "green",
  "Energy Sector": "red",
  "Real Estate Sector": "indigo",
};

const getColorStyling = (sector: string) => {
  const color = (sectorsToColorMap as any)[sector];
  return `border-${color}-500 hover:bg-${color}-700 text-${color}-500 hover:text-${color}-100`;
};

const getButtonColorStyling = (sector: string) => {
  const color = (sectorsToColorMap as any)[sector];
  return `bg-${color}-500 hover:bg-${color}-700 text-${color}-100`;
};

const tutorialTexts = [
  "Welcome to the stock market! This is where you can buy and sell stocks. Stocks are shares of ownership in a company. You can buy and sell stocks to make money.",
  "This is the list of companies you can buy stocks in. Click on a company to see more information about it.",
];
export default function Homepage() {
  const [currentTutorialPanel, setCurrentTutorialPanel] = useState(0);

  const { data, error, loading } = useGraphQLQuery<{
    companies: Company[];
  } | null>(`
    {
      companies {
        name
        id
        ticker
        sector
        currentPrice
      } 
    }`);

  function sendToCompanyPage(id: string) {
    // send to /id/trading
    const homeRoute = window.location.href.split("/")[2];
    window.location.href = `http://${homeRoute}/${id}/trading`;
  }

  if (loading || !data) {
    return <Loading />;
  }

  return (
    <>
      <TutorialWrapper
        currentPanel={currentTutorialPanel}
        showPanel={0}
        maxPanel={1}
      >
        <div className="min-h-screen w-screen p-20 bg-custom-bg">
          <TutorialWrapper
            currentPanel={currentTutorialPanel}
            showPanel={0}
            maxPanel={1}
          >
            <div className="flex gap-3 w-full p-4 flex-wrap mt-16 bg-white shadow-lg rounded z-10">
              {data?.companies.map((company: any) => (
                <button
                  className={
                    "bg-white shadow-md border w-40 h-40 flex flex-col items-start justify-center rounded " +
                    `${getColorStyling(company.sector)}`
                  }
                  onClick={() => sendToCompanyPage(company.id)}
                >
                  <h1 className="text-lg p-4 text-left h-24">{company.name}</h1>
                  <p
                    className={`text-white rounded-r font-semibold p-2 mb-2 ${getButtonColorStyling(
                      company.sector
                    )}`}
                  >
                    ${company.ticker}
                  </p>
                </button>
              ))}
            </div>
          </TutorialWrapper>
        </div>
      </TutorialWrapper>
      <TutorialMonkey
        texts={tutorialTexts}
        name="Homepage"
        setNextPanel={() => setCurrentTutorialPanel(currentTutorialPanel + 1)}
        setPreviousPanel={() =>
          setCurrentTutorialPanel(currentTutorialPanel - 1)
        }
        setPanelNumber={setCurrentTutorialPanel}
      />
    </>
  );
}
