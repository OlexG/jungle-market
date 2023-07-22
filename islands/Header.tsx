import { useEffect, useState } from "preact/hooks";

const HeaderLink = (props: {to: string, text: string}) => {
  return (
    <a
      href={props.to}
      className="w-20 h-10 rounded-sm shadow bg-custom-tan mr-2 hover:scale-105 flex flex-row items-center justify-center "
    >
      <span
        className="text-gray-500 text-1xl font-bold"
        style={{ letterSpacing: "-0.595px" }}
      >
        {props.text}
      </span>
    </a>
  );
};

export function Header() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userId, setUserId] = useState(0);
  useEffect(() => {
    if (localStorage.getItem("userData")) {
      const object = JSON.parse(localStorage.getItem("userData") as any);
      setUserId(object.id);
      setIsSignedIn(true);
    }
  }, []);

  return (
    <header className="w-screen h-16 bg-green-500 overflow-hidden fixed top-0 left-0 w-full z-50 shadow">
      <a 
        href={'/'}
        className="flex w-full h-full items-center pl-10 pr-4 text-white text-5xl font-bold leading-normal">
        Jungle Market
      </a>
      <div className="absolute top-1 left-10">
        <div className="w-1 h-4 sm:w-1 sm:h-3 transform bg-custom-red absolute top-2 left-0">
        </div>
        <div className="w-5 h-1 sm:w-4 sm:h-1 transform bg-custom-red absolute top-1">
        </div>
      </div>

      <div className="absolute top-16 left-60 w-32 rotate-180">
        <div className="w-1 h-4 sm:w-1 sm:h-3 transform bg-custom-red absolute top-2 left-0">
        </div>
        <div className="w-5 h-1 sm:w-4 sm:h-1 transform bg-custom-red absolute top-1">
        </div>
      </div>

      <div className="absolute top-0 right-0 flex items-center h-full pr-4">
        <HeaderLink to="/class" text="Class" />
        {
          isSignedIn ?
            <HeaderLink to={`/profile/${userId}`} text="Profile" />
            :
            <HeaderLink to="/signin" text="Sign In" />
        }
      </div>
    </header>
  );
}

export default Header;
