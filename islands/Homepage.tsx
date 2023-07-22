import { useGraphQLQuery } from "../hooks/useGraphQLQuery.ts";
import { Company } from "../routes/models/company.ts";
import { sectorNames } from "../generation/nameGeneration.ts";

const colors = [
  "yellow",
  "blue",
  "indigo",
  "pink",
  "red",
  "green",
];

const sectorsToColorMap = sectorNames.map((sector, index) => ({
  sector,
  color: colors[index % colors.length],
}));

const getColorStyling = (sector: string) => {
  const color = sectorsToColorMap.find((sectorToColor) =>
    sectorToColor.sector === sector
  )?.color;
  return `bg-${color}-500 hover:bg-${color}-700`;
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
        newsStories {
          title
          url
          description
        }
      } 
    }`);

  function sendToCompanyPage(id: string) {
    // send to /id/trading
    const homeRoute = window.location.href.split("/")[2];
    window.location.href = `http://${homeRoute}/${id}/trading`;
  }

  return (
    <div className="min-h-screen bg-custom-dark-main w-screen p-20">
      <div class="flex gap-3 w-full p-4 flex-wrap mt-16 bg-custom-light-main rounded-md z-10">
        {data?.companies.map((company: any) => (
          <button
            class={"w-40 h-40 flex flex-col items-start justify-center rounded-md shadow " +
              `${getColorStyling(company.sector)}`}
            onClick = {() => sendToCompanyPage(company.id)}
          >
            <h1 class="text-lg font-bold p-4 text-white text-left">{company.name}</h1>
            <p class="text-gray-500">{company.description}</p>
            <p className="text-gray-700 bg-custom-tan rounded-md font-bold mx-4 p-2 mb-2 ">
              ${company.ticker}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
