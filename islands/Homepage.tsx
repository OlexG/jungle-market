import { useGraphQLQuery } from "../hooks/useGraphQLQuery.ts";
import Company from "../types/company.ts";  

export default function Homepage() {
  const { data, error, loading } = useGraphQLQuery<
    {
      companies:Company[]
    } | null
  >(`
    {
      companies {
        name
        description
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
    <div class="flex gap-2 w-full p-4">
      {
        data?.companies.map((company: any) => (
          <div class="flex flex-col items-center justify-center w-1/4 h-32 bg-gray-100">
            <h1 class="text-2xl font-bold">{company.name}</h1>
            <p class="text-gray-500">{company.description}</p>
          </div>
        ))
      }
    </div>
  );
}
