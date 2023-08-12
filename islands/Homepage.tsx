import { useGraphQLQuery } from "../hooks/useGraphQLQuery.ts";
import { Company } from "../routes/models/company.ts";
import { sectorNames } from "../generation/nameGeneration.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import Loading from "../components/Loading.tsx";

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

export default function Homepage() {
  const { data, error, loading } = useGraphQLQuery<
    {
      companies: Company[];
    } | null
  >(`
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

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <div className="min-h-screen w-screen p-20 bg-custom-bg">
      <div class="flex gap-3 w-full p-4 flex-wrap mt-16 bg-white shadow-lg rounded z-10">
        {data?.companies.map((company: any) => (
          <button
            class={"bg-white shadow-md border w-40 h-40 flex flex-col items-start justify-center rounded " +
              `${getColorStyling(company.sector)}`}
            onClick={() => sendToCompanyPage(company.id)}
          >
            <h1 class="text-lg p-4 text-left h-24">{company.name}</h1>
            <p
              className={`text-white rounded-r font-semibold p-2 mb-2 ${
                getButtonColorStyling(company.sector)
              }`}
            >
              ${company.ticker}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
