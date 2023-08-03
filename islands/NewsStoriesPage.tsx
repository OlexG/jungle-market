import { useState } from "preact/hooks";
import { useGraphQLQuery } from "../hooks/useGraphQLQuery.ts";
import { NewsStory } from "../routes/models/newsStory.ts";
import NewsStoriesPageComponent from "../components/NewsStoriesPageComponent.tsx";
const getNewsStoriesQuery = (page: number, pageSize: number) => `{
  newsStories(page: ${page}, pageSize: ${pageSize}) {
    id
    title
    createdAt
    company {
      id
      ticker
      name
    }
  }
}`

export default function NewsStoriesPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, error, loading } = useGraphQLQuery<{ newsStories: NewsStory[] } | null>(
    getNewsStoriesQuery(currentPage, pageSize)
  );

  console.log(data)
  return (
    <div>
      <h1 className="pt-24 font-semibold text-custom-grey text-xl mx-10">News Stories</h1>
      {data?.newsStories.map((newsStory) => (
        <NewsStoriesPageComponent
          id = {newsStory.id}
          title = {newsStory.title}
          createdAt = {newsStory.createdAt}
          companyId = {newsStory.company.id}
          companyTicker = {newsStory.company.ticker}
          companyName = {newsStory.company.name}
        />
      ))}
    </div>
  );
}