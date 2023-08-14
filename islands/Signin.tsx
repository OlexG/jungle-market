import { useEffect } from "preact/hooks";

const CLIENT_ID =
  "633773348546-nem5d1e5mds0dgbvi54t7b7fglev98lb.apps.googleusercontent.com";

interface IProps {
  redirect: string;
}
export default function Signin(
  props: IProps
) {
  const loginWithGoogle = () => {
    const url =
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${props.redirect}&response_type=code&scope=openid%20email%20profile`;
    window.location.href = url;
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const url = new URL(window.location.href);
    if (url.searchParams.get("code")) {
      // Send the code to google to get the token
      const code = url.searchParams.get("code");
      fetch(`/api/auth?code=${code}`)
        .then((res) => res.json())
        .then((data) => {
          // Save to local storage and redirect to homepage
          if (data.error || !data.sessionToken) {
            // TODO: Show error message
          } else {
            localStorage.setItem("userData", JSON.stringify(data));
            window.location.href = "/home";
          }
        });
    }
  }, []);

  return (
    <div className="bg-custom-bg min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="w-40 h-40 sm:w-80 sm:h-80 transform rotate-45 bg-indigo-500 absolute top-0 left-0">
      </div>
      <div className="w-20 h-20 sm:w-40 sm:h-40 transform bg-indigo-500 absolute top-0 left-0">
      </div>

      <div className="w-40 h-40 sm:w-80 sm:h-80 transform rotate-45 bg-blue-500 absolute bottom-0 right-0">
      </div>
      <div className="w-20 h-20 sm:w-40 sm:h-40 transform bg-blue-500 absolute bottom-0 right-0">
      </div>

      <h1 className="text-custom-light-main text-5xl font-sans font-bold leading-normal tracking-wide mb-4">
        Sign In
      </h1>

      <div className="w-[368px] h-[180] bg-white rounded font-sans shadow flex flex-col items-center shadow-lg shadow-gray-200">
        <button
          className="text-center p-4 bg-yellow-500 rounded m-4 mb-7 mt-7 text-gray-700 text-2xl font-bold hover:scale-105 focus:outline-none"
          onClick={loginWithGoogle}
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}
