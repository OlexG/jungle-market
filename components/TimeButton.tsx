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
      className={`text-blue-500 w-20 h-10 rounded shadow border border-blue-500 mr-2 hover:scale-105 flex flex-row items-center justify-center ${
        props.currentType === props.thisType ? "bg-blue-500 text-white" : "bg-white "
      }`}
      onClick={() => props.setCurrentType(props.thisType)}
      disabled={props.currentType === props.thisType}
    >
      <span
        className={`text-1xl`}
        style={{ letterSpacing: "-0.595px" }}
      >
        {props.thisText}
      </span>
    </button>
  );
}
