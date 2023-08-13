import { useEffect, useState } from "preact/hooks";
import useuserId from "../hooks/useUserID.ts";

const HeaderLink = (props: {to: string, text: string}) => {
  return (
    <a
      href={props.to}
      className="w-20 h-10 rounded shadow border border-custom-dark-green bg-white mr-2 hover:scale-105 flex flex-row items-center justify-center "
    >
      <span
        className="text-custom-dark-green text-1xl"
        style={{ letterSpacing: "-0.595px" }}
      >
        {props.text}
      </span>
    </a>
  );
};

export function Header() {
  const userId = useuserId();

  return (
    <header className="w-screen h-14 bg-custom-light-green overflow-hidden fixed top-0 left-0 w-full z-50 shadow">
      <a 
        href={'/home'}
        className="flex w-98 h-full items-center pl-10 pr-4 text-white text-5xl font-semibold leading-normal">
        Jungle Market
      </a>
      <div className="absolute top-0 left-12">
        <div className="w-1 h-4 sm:w-1 sm:h-3 transform bg-custom-red absolute top-2 left-0">
        </div>
        <div className="w-5 h-1 sm:w-4 sm:h-1 transform bg-custom-red absolute top-1">
        </div>
      </div>

      <div className="absolute top-15 left-56 w-32 rotate-180">
        <div className="w-1 h-4 sm:w-1 sm:h-3 transform bg-custom-red absolute top-2 left-0">
        </div>
        <div className="w-5 h-1 sm:w-4 sm:h-1 transform bg-custom-red absolute top-1">
        </div>
      </div>

      <div className="absolute top-0 right-0 flex items-center h-full pr-4">
        <HeaderLink to="/joinclass" text="Class" />
        <HeaderLink to="/news" text="News" />
        <HeaderLink to="/leaderboard" text="Rankings" />
        {
          userId ?
            <HeaderLink to={`/profile/${userId}`} text="Profile" />
            :
            <HeaderLink to="/signin" text="Sign In" />
        }
      </div>
    </header>
  );
}

export default Header;
