import { useEffect, useState } from "preact/hooks";

export default function JoinPage() {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const [pin, setPin] = useState("");
  const [isClicked, setIsClicked] = useState(false);

  const handleEnterKeyPress = (event: any) => {
    if (event.key === "Enter") {
      console.log(pin);
    }
  };

  const handlePinChange = (event: any) => {
    setPin(event.target.value);
  };

  const handleClick = () => {
    console.log(pin);
    setIsClicked(true);

    setTimeout(() => {
      setIsClicked(false);
    }, 1000);
  };

  return (
    <div className="bg-custom-tan min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="w-40 h-40 sm:w-80 sm:h-80 transform rotate-45 bg-custom-light-tan absolute top-0 left-0">
      </div>
      <div className="w-20 h-20 sm:w-40 sm:h-40 transform bg-custom-light-tan absolute top-0 left-0">
      </div>

      <div className="w-40 h-40 sm:w-80 sm:h-80 transform rotate-45 bg-custom-light-tan absolute bottom-0 right-0">
      </div>
      <div className="w-20 h-20 sm:w-40 sm:h-40 transform bg-custom-light-tan absolute bottom-0 right-0">
      </div>

      <h1 className="text-white text-5xl font-sans font-bold leading-normal tracking-wide mb-4">
        Join Class
      </h1>

      <div className="w-[368px] h-[180px] bg-custom-off-white rounded-xl font-sans shadow">
        <div className="w-[295px] h-[52px] border-2 border-custom-brown bg-custom-off-white mx-auto mt-7 flex flex-col justify-center">
          <input
            type="text"
            className="flex-grow text-gray-500 bg-transparent text-2xl font-bold placeholder-gray-500 text-opacity-50 text-center focus:outline-none"
            placeholder="PIN"
            style={{ letterSpacing: "-0.595px" }}
            value={pin}
            onChange={handlePinChange}
            onKeyDown={handleEnterKeyPress}
          />
        </div>

        <button
          className={`w-[295px] h-[52px] bg-custom-brown mx-auto mt-5 flex justify-center hover:scale-105 focus:outline-none items-center ${
            isClicked ? "animate-pulse " : ""
          }`}
          onClick={handleClick}
        >
          <span
            className="text-white text-2xl font-bold"
            style={{ letterSpacing: "-0.595px" }}
          >
            Enter
          </span>
        </button>
      </div>
    </div>
  );
}
