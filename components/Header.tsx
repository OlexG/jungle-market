import { h } from "preact";

function userSigned() {
  const userData = localStorage.getItem("userData");
  if (userData) {
    return true;
  }
  return false;
}

export function Header() {
  const redirectToTrade = () => {
    window.location.href = "http://localhost:8000/trading";
  };

  const redirectToClass = () => {
    window.location.href = "http://localhost:8000/joinclass";
  };

  const redirectToProfile = () => {
    window.location.href = "http://localhost:8000/profile";
  };

  return (
    <header className="w-screen h-16 bg-green-500 overflow-hidden relative">
      <div className="flex w-full h-full items-center pl-10 pr-4 text-white text-5xl font-bold leading-normal">
        Jungle Market
      </div>
      <div className="absolute top-1 left-10">
        <div className="w-1 h-4 sm:w-1 sm:h-3 transform bg-custom-red absolute top-2 left-0">
        </div>
        <div className="w-5 h-1 sm:w-4 sm:h-1 transform bg-custom-red absolute top-1">
        </div>
      </div>

      <div className="absolute top-17 left-60 w-32 rotate-180">
        <div className="w-1 h-4 sm:w-1 sm:h-3 transform bg-custom-red absolute top-2 left-0">
        </div>
        <div className="w-5 h-1 sm:w-4 sm:h-1 transform bg-custom-red absolute top-1">
        </div>
      </div>

      <div className="absolute top-0 right-0 flex items-center h-full pr-4">
        <button
          className="w-14 h-10 bg-custom-tan mr-2 hover:scale-105 rounded-md"
          onClick={redirectToTrade}
        >
          <span
            className="text-white text-1xl font-bold"
            style={{ letterSpacing: "-0.595px" }}
          >
            Trade
          </span>
        </button>
        <button
          className="w-14 h-10 bg-custom-tan mr-2 hover:scale-105 rounded-md"
          onClick={redirectToClass}
        >
          <span
            className="text-white text-1xl font-bold"
            style={{ letterSpacing: "-0.595px" }}
          >
            Class
          </span>
        </button>
        <button
          className="w-14 h-10 bg-custom-tan hover:scale-105 rounded-md"
          onClick={redirectToProfile}
        >
          <span
            className="text-white text-1xl font-bold"
            style={{ letterSpacing: "-0.595px" }}
          >
            Profile
          </span>
        </button>
      </div>
    </header>
  );
}

export default Header;
