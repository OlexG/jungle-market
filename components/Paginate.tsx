import { useState } from "preact/hooks";

interface IProps {
  firstLabel: string;
  nextLabel: string;
  onPageChange: (newPage: number) => void;
  pageRangeDisplayed: number;
  pageCount: number;
  previousLabel: string;
  lastLabel: string;
}

export default function Paginate(props: IProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const handlePageClick = (pageNumber: number) => {
    if (pageNumber < 0 || pageNumber > props.pageCount) return;
    setCurrentPage(pageNumber);
    props.onPageChange(pageNumber);
  };

  let startPage = currentPage - Math.floor(props.pageRangeDisplayed / 2);
  if (startPage < 1) startPage = 0;
  if (startPage + props.pageRangeDisplayed - 1 > props.pageCount) {
    startPage = props.pageCount - props.pageRangeDisplayed + 1;
  }

  const pageNumbers = Array.from(
    { length: props.pageRangeDisplayed },
    (_, i) => i + startPage,
  );

  return (
    <div className="flex justify-center absolute bottom-6 w-full">
      <button
        className="bg-white px-4 mx-2 text-custom-grey flex mt-4 flex-row border border-custom-light-green items-center rounded shadow py-2 hover:bg-custom-light-green hover:text-white hover:border-custom-light-green hover:shadow-lg"
        onClick={() => handlePageClick(1)}
        disabled={currentPage === 1}
      >
        {props.firstLabel}
      </button>
      <button
        className="bg-white px-4 mx-2 text-custom-grey flex mt-4 flex-row border border-custom-light-green items-center rounded shadow py-2 hover:bg-custom-light-green hover:text-white hover:border-custom-light-green hover:shadow-lg"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {props.previousLabel}
      </button>
      {pageNumbers.map((number) =>
        number < 0 ? null : (
          <button
            key={number}
            className={`px-4 mx-2 text-custom-grey flex mt-4 flex-row border border-custom-light-green items-center rounded shadow py-2 ${
              number === currentPage
                ? "bg-custom-light-green text-white"
                : "bg-white hover:bg-custom-light-green hover:text-white hover:border-custom-light-green hover:shadow-lg"
            }`}
            onClick={() => handlePageClick(number)}
          >
            {number + 1}
          </button>
        )
      )}
      <button
        className="bg-white px-4 mx-2 text-custom-grey flex mt-4 flex-row border border-custom-light-green items-center rounded shadow py-2 hover:bg-custom-light-green hover:text-white hover:border-custom-light-green hover:shadow-lg"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === props.pageCount}
      >
        {props.nextLabel}
      </button>
      <button
        className="bg-white px-4 mx-2 text-custom-grey flex mt-4 flex-row border border-custom-light-green items-center rounded shadow py-2 hover:bg-custom-light-green hover:text-white hover:border-custom-light-green hover:shadow-lg"
        onClick={() => handlePageClick(props.pageCount)}
        disabled={currentPage === props.pageCount}
      >
        {props.lastLabel}
      </button>
    </div>
  );
}
