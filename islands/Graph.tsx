import { useEffect, useRef, useState } from "preact/hooks";
import { LineChartDynamic } from "https://deno.land/x/d3nochart@v0.0.2-alpha/charts.ts";

interface IProps {
  data: number[];
}

export default function Graph(props: IProps) {
  const timems = useRef(Date.now());
  console.log(props.data);
  const datasets1 = useRef([
    {
      label: "Last 10 minutes",
      color: "green",
      data:
        props.data.map((value, index) => ({
          x: Date.now() - (props.data.length - index) * 1000,
          y: value,
        })),
      
    },
  ]);
  const [datasets, setData] = useState(datasets1.current);
  const updateTriggerRef = useRef(0);
  const [updateTrigger, setupdateTrigger] = useState(0);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(1000);

  useEffect(() => {
    // get "chart-container div"
    const chartContainer = document.getElementsByClassName('chart-container')[0];
    console.log(chartContainer);
    // make it an HTMLElement
    const chartContainerElement = chartContainer as HTMLElement;
    chartContainerElement.style.backgroundColor = 'rgba(255, 255, 0, 0)';
    chartContainerElement.style.padding = '0px';
    // get the parent div and make it invisible
    const parent = chartContainer.parentElement;
    if (parent) {
      parent.style.padding = '0px';
      parent.style.backgroundColor = 'rgba(255, 255, 0, 0)';
    }

  }, []);
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
