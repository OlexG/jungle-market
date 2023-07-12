import { useEffect, useState } from "preact/hooks";

export default function Tradepage() {
  const [consoleText, setConsoleText] = useState(
    " -- PTRE 12.1% -- BNNNS 11.5% -- PTRR 1.3%",
  );

  const ticker = "PLMP";
  const price = "14.31";
  const percentageGain = "5.6";
  const fullName = "PalmCoast Manufacturers";
  const style = `
    @keyframes rotate {
      0% {
        transform: translateX(100%);
      }
      100% {
        transform: translateX(-100%);
      }
    }
  `;

  return (
    <div className="bg-custom-light-tan min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="w-3/5 h-full transform center bg-custom-tan absolute flex">
        <style>{style}</style>
        <div className="w-4/6 bg-custom-tan relative">
          <div className="w-5/6 mx-auto bg-white rounded-l mt-6 text-lg">
            <div
              className="relative"
              style={{
                position: "relative",
                overflow: "hidden",
              }}
            >
              <p
                className="text-custom-dark-green font-inter font-bold text-20px leading-normal tracking-tighter rotating-text"
                style={{
                  animationName: "rotate",
                  animationDuration: "10s",
                  animationTimingFunction: "linear",
                  animationIterationCount: "infinite",
                }}
              >
                {consoleText}
              </p>
            </div>
          </div>

          <div className="w-5/6 h-2/7 mx-auto bg-custom-tan rounded-l mt-6 text-lg flex flex-col items-start justify-between">
            <div>
              <div className="flex justify-between">
                {/* Updated */}
                <div className="text-white font-inter text-3xl font-bold">
                  {ticker + " $" + price}
                </div>
                <div
                  className={`mt-2 ml-2 font-inter text-xl ${
                    parseFloat(percentageGain) > 0
                      ? "text-custom-dark-green"
                      : parseFloat(percentageGain) < 0
                      ? "text-custom-red"
                      : "text-gray-500"
                  }`}
                >
                  {percentageGain + "%"}
                </div>
              </div>
              <div className="text-white font-inter text-xs">
                {fullName}
              </div>
            </div>
          </div>
        </div>
        {/* Stock graph div */}
        <div className="w-2/6 bg-white"></div>
        {/* Watchlist div */}
      </div>
    </div>
  );
}
