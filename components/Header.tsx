import { h, JSX } from "preact";

// unfinished
export function Header() {
  return (
    <header className="w-screen h-16 bg-green-500 overflow-hidden relative">
      <div className="flex w-full h-full items-center pl-20 pr-4 text-white text-5xl font-bold leading-normal">
        Jungle Market
      </div>
      <div className="absolute top-1 left-20">
        <div className="w-1 h-4 sm:w-1 sm:h-5 transform bg-custom-red absolute top-2 left-0">
        </div>
        <div className="w-5 h-1 sm:w-4 sm:h-1 transform bg-custom-red absolute top-1">
        </div>
      </div>

      <div className="absolute top-17 left-80 w-20 rotate-180">
        <div className="w-1 h-4 sm:w-1 sm:h-5 transform bg-custom-red absolute top-2 left-0">
        </div>
        <div className="w-5 h-1 sm:w-4 sm:h-1 transform bg-custom-red absolute top-1">
        </div>
      </div>

      <div className="absolute top-0 right-0 flex items-center h-full pr-4">
        <div className="w-8 h-8 bg-gray-400 mr-2"></div>
        <div className="w-8 h-8 bg-gray-400 mr-2"></div>
        <div className="w-8 h-8 bg-gray-400"></div>
      </div>
    </header>
  );
}

export default Header;
