import { useState } from "preact/hooks";
import { useGraphQLQuery } from "../hooks/useGraphQLQuery.ts";
import { NewsStory } from "../routes/models/newsStory.ts";
import NewsStoriesPageComponent from "../components/NewsStoriesPageComponent.tsx";
import Paginate from "../components/Paginate.tsx";

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
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { data, error, loading } = useGraphQLQuery<{ newsStories: NewsStory[] } | null>(
    getNewsStoriesQuery(currentPage, itemsPerPage)
  );


  const [itemOffset, setItemOffset] = useState(0);

  const items = data?.newsStories?.sort(
    (a, b) => parseInt(b.createdAt) - parseInt(a.createdAt)
  ) || [];
  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (newPage: number) => {
    const newOffset = (newPage * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  return (
    <div>
      <h1 className="pt-24 font-semibold text-custom-grey text-xl mx-10">News Stories</h1>
      {currentItems.map((newsStory) => (
        <NewsStoriesPageComponent
          id = {newsStory.id}
          title = {newsStory.title}
          createdAt = {newsStory.createdAt}
          companyId = {newsStory.company.id}
          companyTicker = {newsStory.company.ticker}
          companyName = {newsStory.company.name}
        />
      ))}
      <Paginate
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount - 1}
        previousLabel="<"
        firstLabel="<<"
        lastLabel=">>"
      />
      <div className="h-8"></div>
    </div>
  );
}