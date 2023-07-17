interface IProps {
  currentType: string;
  setCurrentType: (type: string) => void;
  thisType: string;
  thisText: string;
}

export default function TimeButton(props: IProps) {
  return (
    <button
      className={`w-20 h-10 rounded shadow bg-custom-tan mr-2 hover:scale-105 flex flex-row items-center justify-center ${
        props.currentType === props.thisType ? "bg-custom-dark-green" : ""
      }`}
      onClick={() => props.setCurrentType(props.thisType)}
      disabled={props.currentType === props.thisType}
    >
      <span
        className={`text-white text-1xl font-bold`}
        style={{ letterSpacing: "-0.595px" }}
      >
        {props.thisText}
      </span>
    </button>
  );
}
