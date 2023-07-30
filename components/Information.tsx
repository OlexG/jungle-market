import { Company } from "../routes/models/company.ts";

interface IProps {
  company: Company | undefined;
}

const formatMoney = (n: number | undefined) => {
  if (n === undefined) {
    return "";
  }
  return `$${n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")}`;
}

const formatPercent = (n: number | undefined) => {
  if (n === undefined) {
    return "";
  }
  const actualPercent = n * 100;
  return `${actualPercent.toFixed(2)}%`;
}

export default function Information(props: IProps) {
  return (
    <div className="w-full grid grid-cols-2 gap-2">
      <div className="border border-indigo-500 bg-white rounded mt-4 p-10 shadow">
        <h1 className="text-indigo-500 text-lg pb-2 mt-1 font-semibold">Information</h1>
        <p>
          <span className="font-semibold text-indigo-500">CEO: </span>
          {props.company?.ceo}
        </p>
        <p>
          <span className="font-semibold text-indigo-500 mt-1">Sector: </span>
          {props.company?.sector}
        </p>
        <p>
          <span className="font-semibold text-indigo-500 mt-1">About: </span>
          {props.company?.description}
        </p>
      </div>
      <div className="border border-pink-500 bg-white rounded mt-4 p-10 shadow">
        <h1 className="text-lg pb-2 mt-1 text-pink-500 font-semibold">Fundamentals</h1>
        <p>
          <span className="font-semibold text-pink-500 mt-1">Net Income: </span>
          <span className="text-green-700 font-semibold">{formatMoney(props.company?.netIncome)}</span>
        </p>
        <p>
          <span className="font-semibold text-pink-500">ROE: </span>
          {formatPercent(props.company?.roe)}
        </p>
        <p>
          <span className="font-semibold text-pink-500 mt-1">PE Ratio: </span>
          {props.company?.peRatio}
        </p>
        <p>
          <span className="font-semibold text-pink-500 mt-1">DE Ratio: </span>
          {props.company?.deRatio}
        </p>
        <p>
          <span className="font-semibold text-pink-500 mt-1">Gross Margin: </span>
          {formatPercent(props.company?.grossMargin)}
        </p>
      </div>
    </div>
  );
}
