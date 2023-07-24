import { useEffect, useRef, useState } from "preact/hooks";
import { LineChartDynamic } from "https://deno.land/x/d3nochart@v0.0.2-alpha/charts.ts";

interface IProps {
  data: number[];
  type: "10 minutes" | "hourly" | "daily" | "30 days";
}
const MAX_PRICE = 2000

export default function Graph(props: IProps) {
  const timems = useRef(Date.now());
  const [datasets, setData] = useState<any>(null);
  let mins = {
    "10 minutes": 0,
    hourly: 0,
    daily: 0,
    "30 days": 0,
  };

  let maxs = {
    "10 minutes": MAX_PRICE,
    hourly: MAX_PRICE,
    daily: MAX_PRICE,
    "30 days": MAX_PRICE,
  };

  function getMinsAndMaxes() {
    if (datasets && datasets[0].data && datasets[0].data.length > 0) {
      const yData = datasets[0].data.map((value: any) => value.y);
      if (props.type === "10 minutes") {
        const min = Math.min(...yData) - 10;
        // Round down to nearest 10, but dont accept anything more than 0
        const roundedMin = Math.max(Math.floor(min / 10) * 10, 0);
        if (mins["10 minutes"] === 0 || mins["10 minutes"] > roundedMin) {
          mins = { ...mins, "10 minutes": roundedMin };
        }

        const max = Math.max(...yData) + 10;
        // Round up to nearest 10
        const roundedMax = Math.ceil(max / 10) * 10;
        if (maxs["10 minutes"] === MAX_PRICE || maxs["10 minutes"] < roundedMax) {
          maxs = { ...maxs, "10 minutes": roundedMax };
        }
      } else if (props.type === "hourly") {
        const min = Math.min(...yData) - 20;
        // Round down to nearest 20, but dont accept anything more than 0
        const roundedMin = Math.max(Math.floor(min / 20) * 20, 0);
        if (mins.hourly === 0 || mins.hourly > roundedMin) {
          mins = { ...mins, hourly: roundedMin };
        }

        const max = Math.max(...yData) + 20;
        // Round up to nearest 20
        const roundedMax = Math.ceil(max / 20) * 20;
        if (maxs.hourly === MAX_PRICE || maxs.hourly < roundedMax) {
          maxs = { ...maxs, hourly: roundedMax };
        }
      } else if (props.type === "daily") {
        const min = Math.min(...yData) - 50;
        // Round down to nearest 50, but dont accept anything more than 0
        const roundedMin = Math.max(Math.floor(min / 50) * 50, 0);
        if (mins.daily === 0 || mins.daily > roundedMin) {
          mins = { ...mins, daily: roundedMin };
        }

        const max = Math.max(...yData) + 50;
        // Round up to nearest 50
        const roundedMax = Math.ceil(max / 50) * 50;
        if (maxs.daily === MAX_PRICE || maxs.daily < roundedMax) {
          maxs = { ...maxs, daily: roundedMax };
        }
      }
    }
    return { mins, maxs };
  }

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
          height={370}
          width={550}
          paddingTop={0} //@ts-ignore
          paddingBottom={-5} //@ts-ignore
          datasets={datasets} //@ts-ignore
          data={datasets[0].data}
          yAxisAuto={false}
          yAxisMin={getMinsAndMaxes().mins[props.type]}
          yAxisMax={getMinsAndMaxes().maxs[props.type]}
          updateTrigger={updateTrigger}
          addLabel={false}
          addLegend={false}
          addTooltip={false}
        ></LineChartDynamic>
      </div>
    </>
  );
}
