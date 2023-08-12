import Header from "../islands/Header.tsx";
import Footer from "../components/Footer.tsx";
import SigninPage from '../islands/Signin.tsx'
import { config } from "mod";
let { RED_URL } = config();
if (!RED_URL) {
  RED_URL = Deno.env.get("RED_URL") || "http://localhost:3000";
}

export default function Signin() {
  return (
    <>
      <Header/>
      <SigninPage
        redirect={RED_URL}
      />
    </>
  )
}