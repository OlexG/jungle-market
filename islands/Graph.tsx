import { useEffect, useRef, useState } from "preact/hooks";
import { LineChartDynamic } from "https://deno.land/x/d3nochart@v0.0.2-alpha/charts.ts";

interface IProps {
  data: number[];
  type: string;
}

export default function Graph(props: IProps) {
  const timems = useRef(Date.now());
  const [datasets, setData] = useState<any>(null);
  useEffect(() => {
    if (props.type === "10 minutes") {
      setData([
        {
          label: "Last 10 minutes",
          color: "green",
          data: props.data.map((value, index) => ({
            x: Date.now() - 600000 + (index + 1) * 60000,
            y: value,
          })),
        },
      ]);
    } else if (props.type === "hourly") {
      setData([
        {
          label: "Last hour, every 5 minutes",
          color: "green",
          data: props.data.map((value, index) => ({
            x: Date.now() - 3600000 + (index + 1) * 300000,
            y: value,
          })),
        },
      ]);
    } else if (props.type === "daily") {
      setData([
        {
          label: "Last day, hourly",
          color: "green",
          data: props.data.map((value, index) => ({
            x: Date.now() - 86400000 + (index + 1) * 3600000,
            y: value,
          })),
        },
      ]);
    } else if (props.type === "30 days") {
      setData([
        {
          label: "Last 30 days, daily",
          color: "green",
          data: props.data.map((value, index) => ({
            x: Date.now() - 2592000000 + (index + 1) * 86400000,
            y: value,
          })),
        },
      ]);
    }
  }, [props.data, props.type]);

  const updateTriggerRef = useRef(0);
  const [updateTrigger, setupdateTrigger] = useState(0);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(1000);

  useEffect(() => {
    // get "chart-container div"
    const chartContainer =
      document.getElementsByClassName("chart-container")[0];
    // make it an HTMLElement
    const chartContainerElement = chartContainer as HTMLElement;
    chartContainerElement.style.backgroundColor = "rgba(255, 255, 0, 0)";
    chartContainerElement.style.padding = "0px";
    // get the parent div and make it invisible
    const parent = chartContainer.parentElement;
    if (parent) {
      parent.style.padding = "0px";
      parent.style.backgroundColor = "rgba(255, 255, 0, 0)";
    }
  }, [datasets]);
  if (!datasets) {
    return <div></div>;
  }
  return (
    <>
      <div class="flex flex-row justify-evenly bg-green-50 ml-8">
        <LineChartDynamic
          height={400}
          width={550}
          paddingTop={20} //@ts-ignore
          datasets={datasets} //@ts-ignore
          data={datasets[0].data}
          yAxisAuto={false}
          yAxisMin={min}
          yAxisMax={max}
          updateTrigger={updateTrigger}
          addLabel={false}
          addLegend={false}
          addTooltip={false}
        ></LineChartDynamic>
      </div>
    </>
  );
}
