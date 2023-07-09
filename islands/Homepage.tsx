import { useGraphQLQuery } from "../hooks/useGraphQLQuery.ts";
import { Company } from "../routes/models/company.ts";
import { sectorNames } from "../generation/nameGeneration.ts";

console.log(sectorNames)

const colors = [
  'yellow',
  'blue',
  'indigo',
  'pink',
  'red',
  'green',
]

const sectorsToColorMap = sectorNames.map((sector, index) => ({
  sector,
  color: colors[index % colors.length]
}))

const getColorStyling = (sector: string) => {
  const color = sectorsToColorMap.find((sectorToColor) => sectorToColor.sector === sector)?.color
  return `bg-${color}-400 hover:bg-${color}-500`
}

export default function Homepage() {
  const { data, error, loading } = useGraphQLQuery<
    {
      companies:Company[]
    } | null
  >(`
    {
      companies {
        name
        id
        ticker
        sector
        newsStories {
          title
          url
          description
        }
      } 
    }`
  )
  console.log(data, error, loading)

  return (
    <div class="flex gap-2 w-full p-4 flex-wrap">
      {
        data?.companies.map((company: any) => (
          <div class={"w-40 flex flex-col items-start justify-center rounded shadow " + `${getColorStyling(company.sector)}`}>
            <h1 class="text-lg font-bold p-4 text-white">{company.name}</h1>
            <p class="text-gray-500">{company.description}</p>
            <p className='text-white bg-green-500 border-2 border-white rounded font-bold mx-4 p-2 mb-2'>
              ${company.ticker}
            </p>
          </div>
        ))
      }
    </div>
  );
}
