import { useState } from "preact/hooks";

interface IProps {
  info: {
    ticker: string;
    percentageChange: number;
  }[] | undefined;
}

const PAGE_SIZE = 7;

export default function InvestmentsPanel(props: IProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const getInfo = () => {
    if (!props.info) return [];
    const start = currentPage * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return props.info.slice(start, end);
  };

  const setNextPage = () => {
    if (!props.info) return;
    if (currentPage < props.info.length / PAGE_SIZE - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const setPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col items-center h-full justify-between">
      <div className="text-custom-gray font-inter text-3xl mt-5 flex flex-col justify-center">
        Investments
      </div>
      <div className="">
        <div className="border border-custom-light-green shadow w-56 rounded-t mt-4 h-72">
          {props.info ? getInfo().map((info, index) => (
            <button
              key={index}
              className={`shadow mt-2 button-style w-3/4 h-10 ml-6 ${
                info.percentageChange < 0
                  ? "text-red-500 rounded border border-red-500 bg-white"
                  : info.percentageChange > 0
                  ? "text-green-500 rounded border border-green-500 bg-white"
                  : "text-gray-500 rounded border border-gray-500 bg-white"   // we need to make it so that when it is 0.0% it does not truncate.
              } font-inter text-20px hover:text-lg`}
            >
              {info.ticker} {info.percentageChange}%
            </button>
          )) : 
          <p className="text-center px-2 py-2">
            Please login to see portfolio
          </p>
        }
        </div>
        <div className="px-8 py-2 bg-custom-light-green w-56 flex flex-row justify-between items-center">
          <button
            className="text-3xl"
            onClick={setPreviousPage}
            style={{ outline: "none" }}
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24">
              <path
                fill="white"
                d="M15.41 7.41L10.83 12l4.58 4.59L14 18l-6-6 6-6z"
              ></path>
            </svg>
          </button>
          <button
            className="text-3xl"
            onClick={setNextPage}
            style={{ outline: "none" }}
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24">
              <path
                fill="white"
                d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
