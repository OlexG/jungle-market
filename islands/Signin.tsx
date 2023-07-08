import { useEffect } from "preact/hooks"

const CLIENT_ID = "633773348546-nem5d1e5mds0dgbvi54t7b7fglev98lb.apps.googleusercontent.com"
const REDIRECT_URI = "http://localhost:8000/signin"

export default function Signin() {
  const loginWithGoogle = () => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid%20email%20profile`
    window.location.href = url
  }

  useEffect(() => {
    const url = new URL(window.location.href)
    if (url.searchParams.get("code")) {
      // Send the code to google to get the token
      const code = url.searchParams.get("code")
      fetch(`/api/auth?code=${code}`)
        .then((res) => res.json())
        .then((data) => {
          // Save to local storage and redirect to homepage
          if (data.error) {
            // TODO: Show error message
          } else {
            localStorage.setItem("userData", JSON.stringify(data))
            window.location.href = "/"
          }
        })
    }
  }, [])

  return (
    <div className="bg-custom-tan min-h-screen flex flex-col items-center justify-center overflow-hidden">

      <div className="w-40 h-40 sm:w-80 sm:h-80 transform rotate-45 bg-custom-light-tan absolute top-0 left-0"></div>
      <div className="w-20 h-20 sm:w-40 sm:h-40 transform bg-custom-light-tan absolute top-0 left-0"></div>

      <div className="w-40 h-40 sm:w-80 sm:h-80 transform rotate-45 bg-custom-light-tan absolute bottom-0 right-0"></div>
      <div className="w-20 h-20 sm:w-40 sm:h-40 transform bg-custom-light-tan absolute bottom-0 right-0"></div>

      <div className="w-[368px] bg-custom-off-white rounded-xl font-sans shadow flex flex-col items-center">
        <h1 className="text-custom-brown text-3xl font-sans font-bold leading-normal text-center p-4">
          Sign In
        </h1>
        <button className="text-center p-4 bg-custom-brown rounded m-4 mb-8 mt-0 text-custom-off-white font-bold" onClick={loginWithGoogle}>
          Login with Google
        </button>
      </div>
    </div>
  );
}