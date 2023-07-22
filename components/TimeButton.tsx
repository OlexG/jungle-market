import { TimeType } from "./types/types.tsx";

interface IProps {
  currentType: TimeType;
  setCurrentType: (type: TimeType) => void;
  thisType: TimeType;
  thisText: string;
}

export default function TimeButton(props: IProps) {
  return (
    <button
      className={`w-20 h-10 rounded shadow bg-custom-dark-green mr-2 hover:scale-105 flex flex-row items-center justify-center ${
        props.currentType === props.thisType ? "bg-custom-light-green" : ""
      }`}
      onClick={() => props.setCurrentType(props.thisType)}
      disabled={props.currentType === props.thisType}
    >
      <span
        className={`text-custom-off-white text-1xl font-bold`}
        style={{ letterSpacing: "-0.595px" }}
      >
        {props.thisText}
      </span>
    </button>
  );
}
