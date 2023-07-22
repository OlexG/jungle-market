import { useGraphQLQuery } from "../hooks/useGraphQLQuery.ts";
import { Company } from "../routes/models/company.ts";
import { sectorNames } from "../generation/nameGeneration.ts";

console.log(sectorNames);

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
  return `bg-${color}-400 hover:bg-${color}-500`;
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
    <div class="flex gap-3 w-full p-4 flex-wrap mt-16 bg-custom-dark-brown">
      {data?.companies.map((company: any) => (
        <button
          class={"w-40 flex flex-col items-start justify-center rounded-sm shadow " +
            `${getColorStyling(company.sector)}`}
          onClick = {() => sendToCompanyPage(company.id)}
        >
          <h1 class="text-lg font-bold p-4 text-white text-left">{company.name}</h1>
          <p class="text-gray-500">{company.description}</p>
          <p className="text-white bg-custom-light-brown rounded-sm font-bold mx-4 p-2 mb-2 ">
            ${company.ticker}
          </p>
        </button>
      ))}
      <div class="min-h-screen w-full flex-wrap bg-custom-dark-brown"></div>
    </div>
  );
}
